// Junta as partes de cada instalador (o GitHub não aceita arquivos > 100 MB)
// e gera a pasta dist/ que a Vercel publica.
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const SHA = {
  'LimoShot-1.0.7-mac-arm64.dmg': '95690e153e515787d8bb1bd94f4f33014c2d082a4bc238cf7c45372ce8faeb4d',
  'LimoShot-1.0.7-mac-x64.dmg': '134476a32bdd4508037e03a02d3161009ee6566512a83a5b7418e75f898cc9f3',
  'LimoShot-1.0.7-win-x64.exe': '6792f75a5234d0455a221511fbdbb18c35d69b1c94fe19416387be203b9d3d6b',
}

fs.rmSync('dist', { recursive: true, force: true })
fs.mkdirSync('dist')
const partes = fs.readdirSync('parts').sort()
for (const nome of Object.keys(SHA)) {
  const minhas = partes.filter((p) => p.startsWith(nome + '.part'))
  if (!minhas.length) throw new Error('Sem partes para ' + nome)
  const buf = Buffer.concat(minhas.map((p) => fs.readFileSync(path.join('parts', p))))
  const h = crypto.createHash('sha256').update(buf).digest('hex')
  if (h !== SHA[nome]) throw new Error('Checksum errado para ' + nome)
  fs.writeFileSync(path.join('dist', nome), buf)
  console.log('ok', nome, buf.length)
}
fs.writeFileSync('dist/index.html', '<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=https://space.grupolimoeiro.com.br/limoshot"><title>LimoShot</title>')
