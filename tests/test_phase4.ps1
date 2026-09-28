# Suporte e testes automatizados para Fase 4: Higienização de Dados e index.html

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " EXECUTANDO SUITE DE TESTES - FASE 4: HIGIENIZACAO E INDEX" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Verificacao do index.html
$indexFile = ".\index.html"
if (-not (Test-Path $indexFile)) {
    Write-Host "  [FAIL] Arquivo index.html nao encontrado!" -ForegroundColor Red
    exit 1
} else {
    Write-Host "  [PASS] Arquivo index.html presente na raiz." -ForegroundColor Green
}

# 2. Execucao dos testes automatizados Node.js
Write-Host "`nExecutando testes automatizados via Node.js:" -ForegroundColor Yellow
$nodeResult = node .\tests\test_phase4.js
$nodeExit = $LASTEXITCODE

Write-Host $nodeResult

if ($nodeExit -ne 0) {
    Write-Host "`n[FALHA] Testes da Fase 4 falharam." -ForegroundColor Red
    exit 1
} else {
    Write-Host "`n[SUCESSO] Todos os testes da Fase 4 foram aprovados!" -ForegroundColor Green
    exit 0
}
