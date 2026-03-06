import { promises as fs } from 'node:fs';
import path from 'node:path';

export const readFile = async (filePath: string) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (error: any) {
    return `Error reading file: ${error.message}`;
  }
};

export const writeFile = async (filePath: string, content: string) => {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, 'utf-8');
    return `File written successfully to ${filePath}`;
  } catch (error: any) {
    return `Error writing file: ${error.message}`;
  }
};

export const listFiles = async (dirPath: string) => {
  try {
    const files = await fs.readdir(dirPath, { withFileTypes: true });
    return files.map(file => {
      return file.isDirectory() ? `${file.name}/` : file.name;
    }).join('\n');
  } catch (error: any) {
    return `Error listing files: ${error.message}`;
  }
};

export const searchFiles = async (rootPath: string, pattern: string) => {
  const results: string[] = [];
  
  async function traverse(currentPath: string) {
    try {
        const entries = await fs.readdir(currentPath, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name);
            if (entry.isDirectory()) {
                if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'dist' && entry.name !== 'build') {
                    await traverse(fullPath);
                }
            } else {
                if (entry.name.includes(pattern)) {
                   results.push(fullPath);
                }
            }
        }
    } catch(e) { /* ignore access errors */ }
  }

  await traverse(rootPath);
  return results.length > 0 ? results.join('\n') : "No matching files found.";
};

export const grepFiles = async (rootPath: string, pattern: string) => {
    const findings: string[] = [];
    // Convert pattern to regex if possible, else simple includes
    const isRegex = pattern.startsWith('/') && pattern.endsWith('/');
    const regex = isRegex ? new RegExp(pattern.slice(1, -1)) : null;

    async function traverse(currentPath: string) {
        try {
            const entries = await fs.readdir(currentPath, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(currentPath, entry.name);
                
                if (entry.isDirectory()) {
                   if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'dist' && entry.name !== 'build') { 
                        await traverse(fullPath);
                   }
                } else {
                    // Skip binary or large files naively by extension or just try read
                    if (['.ts', '.js', '.json', '.md', '.html', '.css', '.txt', '.jsx', '.tsx', '.py', '.java', '.c', '.cpp', '.h', '.sh'].includes(path.extname(entry.name))) {
                        try {
                            const content = await fs.readFile(fullPath, 'utf-8');
                            if (regex) {
                                if (regex.test(content)) findings.push(fullPath);
                            } else {
                                if (content.includes(pattern)) findings.push(fullPath);
                            }
                        } catch (e) {}
                    }
                }
            }
        } catch(e) {}
    }

    await traverse(rootPath);
    return findings.length > 0 ? findings.join('\n') : "No files containing the pattern found.";
};


// Extended file system capabilities

export const moveFile = async (source: string, destination: string) => {
    try {
        await fs.mkdir(path.dirname(destination), { recursive: true });
        await fs.rename(source, destination);
        return `Successfully moved ${source} to ${destination}`;
    } catch (error: any) {
        return `Error moving file: ${error.message}`;
    }
}

export const copyFile = async (source: string, destination: string) => {
    try {
        await fs.mkdir(path.dirname(destination), { recursive: true });
        await fs.copyFile(source, destination);
        return `Successfully copied ${source} to ${destination}`;
    } catch (error: any) {
        return `Error copying file: ${error.message}`;
    }
}

export const deleteFile = async (filePath: string) => {
    try {
        await fs.unlink(filePath);
        return `Successfully deleted file ${filePath}`;
    } catch (error: any) {
        return `Error deleting file: ${error.message}`;
    }
}

export const makeDir = async (dirPath: string) => {
    try {
        await fs.mkdir(dirPath, { recursive: true });
        return `Successfully created directory ${dirPath}`;
    } catch (error: any) {
        return `Error creating directory: ${error.message}`;
    }
}

export const deleteDir = async (dirPath: string) => {
    try {
        await fs.rm(dirPath, { recursive: true, force: true });
        return `Successfully deleted directory ${dirPath}`;
    } catch (error: any) {
        return `Error deleting directory: ${error.message}`;
    }
}

export const getFileInfo = async (filePath: string) => {
    try {
        const stats = await fs.stat(filePath);
        return JSON.stringify({
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime,
            isDirectory: stats.isDirectory(),
            isFile: stats.isFile(),
            permissions: stats.mode
        }, null, 2);
    } catch (error: any) {
        return `Error getting file info: ${error.message}`;
    }
}

