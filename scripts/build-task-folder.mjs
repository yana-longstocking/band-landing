import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import sass from 'sass'

const projectRoot = process.cwd()
const outDir = process.argv[2]

if (!outDir) {
  console.error('Usage: node scripts/build-task-folder.mjs <outDir>')
  process.exit(1)
}

const resolvedOutDir = path.resolve(projectRoot, outDir)
const srcDir = path.join(projectRoot, 'src')
const indexHtmlPath = path.join(projectRoot, 'index.html')
const scssEntry = path.join(srcDir, 'main.scss')

if (!fs.existsSync(indexHtmlPath)) {
  console.error(`index.html not found at: ${indexHtmlPath}`)
  process.exit(1)
}

if (!fs.existsSync(scssEntry)) {
  console.error(`main.scss not found at: ${scssEntry}`)
  process.exit(1)
}

fs.rmSync(resolvedOutDir, { recursive: true, force: true })
fs.mkdirSync(resolvedOutDir, { recursive: true })

// Copy everything from src so that ./src/images/... paths in index.html keep working.
fs.cpSync(srcDir, path.join(resolvedOutDir, 'src'), { recursive: true })

// Compile SCSS into a plain stylesheet.
const result = sass.renderSync({
  file: scssEntry,
  includePaths: [srcDir],
})

fs.writeFileSync(path.join(resolvedOutDir, 'main.css'), result.css, 'utf8')

// Create a browser-ready JS file by removing the SCSS import.
// Keep the rest of the file exactly as-is (same ESNext syntax).
const mainJsSrcPath = path.join(srcDir, 'main.js')
let mainJsContent = fs.readFileSync(mainJsSrcPath, 'utf8')
mainJsContent = mainJsContent.replace(/^\s*import\s+['"]\.\/main\.scss['"]\s*;?\s*\n?/m, '')
fs.writeFileSync(path.join(resolvedOutDir, 'main.js'), mainJsContent, 'utf8')

// Patch index.html so it loads the compiled CSS and the browser-ready JS with relative paths.
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8')

// favicon: make it relative to the folder (if favicon exists, it will load; if not, it won't break the page)
indexHtml = indexHtml.replace(/href="\/favicon\.svg"/g, 'href="./favicon.svg"')

// Remove Vite module script tag to /src/main.js and replace with local main.js
indexHtml = indexHtml.replace(
  /<script\s+type="module"\s+src="\/src\/main\.js"><\/script>/m,
  '<script type="module" src="./main.js"></script>',
)

// If the exact script tag differs, do a looser replace as fallback.
indexHtml = indexHtml.replace(
  /<script\s+type="module"\s+src="\/src\/main\.js"\s*>\s*<\/script>/m,
  '<script type="module" src="./main.js"></script>',
)

// Inject stylesheet link in the head (before </head>).
if (!indexHtml.includes('main.css')) {
  indexHtml = indexHtml.replace('</head>', '  <link rel="stylesheet" href="./main.css">\n</head>')
}

fs.writeFileSync(path.join(resolvedOutDir, 'index.html'), indexHtml, 'utf8')

console.log(`Built ${resolvedOutDir}`)

