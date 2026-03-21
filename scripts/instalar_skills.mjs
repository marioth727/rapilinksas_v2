import fs from 'fs';
import path from 'path';

const srcDir = path.resolve('.tmp/stitch-skills/skills');
const destDir = path.resolve('.agents/skills');
const cloneDir = path.resolve('.tmp/stitch-skills');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

function copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
    }
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

try {
    console.log(`[REQUEST] Moviendo skills de ${srcDir} a ${destDir}`);
    copyDirectory(srcDir, destDir);
    console.log(`[RESPONSE] Skills copiadas exitosamente.`);
    
    // Limpieza
    console.log(`[REQUEST] Limpiando repositorio temporal en ${cloneDir}`);
    fs.rmSync(cloneDir, { recursive: true, force: true });
    console.log(`[RESPONSE] Limpieza completada.`);
} catch (e) {
    console.error("Error al copiar skills:", e);
    process.exit(1);
}
