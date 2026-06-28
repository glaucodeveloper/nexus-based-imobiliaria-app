use std::{
    collections::HashMap,
    env,
    fs,
    io::{Cursor, Write},
    path::{Path, PathBuf},
};

use ltk_wad::{WadBuilder, WadChunkBuilder, WadChunkCompression};
use xxhash_rust::xxh64::xxh64;

fn collect_files(root: &Path, dir: &Path, out: &mut Vec<(String, PathBuf)>) -> Result<(), Box<dyn std::error::Error>> {
    for entry in fs::read_dir(dir)? {
        let entry = entry?;
        let path = entry.path();
        if path.is_dir() {
            collect_files(root, &path, out)?;
            continue;
        }

        let rel = path
            .strip_prefix(root)?
            .to_string_lossy()
            .replace('\\', "/")
            .to_lowercase();
        out.push((rel, path));
    }

    Ok(())
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args: Vec<String> = env::args().collect();
    if args.len() != 3 {
        eprintln!("usage: wad-pack <input_tree> <output.wad.client>");
        std::process::exit(2);
    }

    let input = PathBuf::from(&args[1]);
    let output = PathBuf::from(&args[2]);

    let mut files = Vec::new();
    collect_files(&input, &input, &mut files)?;
    files.sort_by(|a, b| a.0.cmp(&b.0));

    let mut by_hash: HashMap<u64, PathBuf> = HashMap::new();
    let mut builder = WadBuilder::default();

    for (rel, path) in files {
        let chunk = WadChunkBuilder::default()
            .with_path(&rel)
            .with_force_compression(WadChunkCompression::Zstd);
        let hash = xxh64(rel.as_bytes(), 0);
        by_hash.insert(hash, path);
        builder = builder.with_chunk(chunk);
        println!("[chunk] {rel}");
    }

    if let Some(parent) = output.parent() {
        fs::create_dir_all(parent)?;
    }

    let mut out_file = fs::File::create(&output)?;
    builder.build_to_writer(&mut out_file, |path_hash, cursor: &mut Cursor<Vec<u8>>| {
        let Some(path) = by_hash.get(&path_hash) else {
            return Err(ltk_wad::WadBuilderError::IoError(std::io::Error::new(
                std::io::ErrorKind::NotFound,
                format!("missing chunk data for {path_hash:016x}"),
            )));
        };
        let data = fs::read(path).map_err(ltk_wad::WadBuilderError::IoError)?;
        cursor.write_all(&data).map_err(ltk_wad::WadBuilderError::IoError)?;
        Ok(())
    })?;

    println!("[done] {}", output.display());
    Ok(())
}
