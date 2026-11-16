const fs = require('fs');
const path = require('path');

const RAW_DIR = path.join(__dirname, '..', 'raw-drive');
const TARGET_DIR = path.join(__dirname, '..', 'assets', 'gastronomia');

function findFilesRecursive(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(findFilesRecursive(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

function normalizeModelCode(filePath) {
  // 1. Procurar padrão 06.01, 14.03, 25.05 etc.
  const matchDotted = filePath.match(/(?:^|[\\/_\-\s])(0[1-9]|[12][0-9])\.(0[1-5])(?:[\\/_\-\s.]|$)/);
  if (matchDotted) {
    return `${matchDotted[1]}.${matchDotted[2]}`;
  }

  // 2. Procurar padrão 06_01 ou 06-01
  const matchHyphen = filePath.match(/(?:^|[\\/_\-\s])(0[1-9]|[12][0-9])[-_](0[1-5])(?:[\\/_\-\s.]|$)/);
  if (matchHyphen) {
    return `${matchHyphen[1]}.${matchHyphen[2]}`;
  }

  // 3. Procurar H01-H05, P01-P05, A01-A05, G01-G05, J01-J05
  const matchOriginal = filePath.match(/(?:^|[\\/_\-\s])([HPA-J]0[1-5])(?:[\\/_\-\s.]|$)/i);
  if (matchOriginal) {
    return matchOriginal[1].toUpperCase();
  }

  return null;
}

function getDeviceType(fileName) {
  const lower = fileName.toLowerCase();
  if (lower.includes('desktop') || lower.includes('1920')) return 'hero-desktop.png';
  if (lower.includes('tablet') || lower.includes('1024') || lower.includes('ipad')) return 'hero-tablet.png';
  if (lower.includes('mobile') || lower.includes('1080') || lower.includes('phone') || lower.includes('celular')) return 'hero-mobile.png';
  return 'hero-desktop.png';
}

function run() {
  console.log('=== ORGANIZADOR DE HEROES DO GOOGLE DRIVE ===');
  if (!fs.existsSync(RAW_DIR)) {
    console.log('Diretório raw-drive não existe ainda. Nenhuma imagem para processar.');
    return;
  }

  const allFiles = findFilesRecursive(RAW_DIR);
  console.log(`Encontrados ${allFiles.length} arquivos no raw-drive.`);

  let processedCount = 0;

  for (const file of allFiles) {
    const ext = path.extname(file).toLowerCase();
    const baseName = path.basename(file);
    const relPath = path.relative(RAW_DIR, file);

    const modelCode = normalizeModelCode(relPath);
    if (!modelCode) {
      console.log(`[PULAR] Modelo não identificado para: ${relPath}`);
      continue;
    }

    const modelDestDir = path.join(TARGET_DIR, modelCode);
    if (!fs.existsSync(modelDestDir)) {
      fs.mkdirSync(modelDestDir, { recursive: true });
    }

    if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
      const targetFileName = getDeviceType(baseName);
      const destPath = path.join(modelDestDir, targetFileName);
      fs.copyFileSync(file, destPath);
      console.log(`[OK] ${modelCode} -> ${targetFileName} (copiado de ${baseName})`);
      processedCount++;
    } else if (ext === '.md') {
      const destPath = path.join(modelDestDir, 'identidade.md');
      fs.copyFileSync(file, destPath);
      console.log(`[OK] ${modelCode} -> identidade.md`);
      processedCount++;
    }
  }

  console.log(`Processamento concluído. ${processedCount} arquivos organizados com sucesso em ${TARGET_DIR}.`);
}

run();
