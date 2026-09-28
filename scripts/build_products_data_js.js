const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'data', 'products_details.json');
const jsOutputPath = path.join(__dirname, '..', 'js', 'products-data.js');

if (!fs.existsSync(jsonPath)) {
    console.error('Arquivo data/products_details.json não encontrado!');
    process.exit(1);
}

const jsonContent = fs.readFileSync(jsonPath, 'utf8');
const products = JSON.parse(jsonContent);
const count = Object.keys(products).length;

console.log(`Carregados ${count} produtos de data/products_details.json.`);

// Gera o arquivo JavaScript com IIFE segura para registrar window.RJ_PRODUCTS_DATA
const jsContent = `/**
 * ====================================================================
 * PROJETO MEUSMÓVEIS — BANCO DE DADOS EM MEMÓRIA (523 PRODUTOS)
 * ====================================================================
 * Carregamento síncrono e instantâneo sem dependência de fetch() ou CORS.
 * Compatível com execução local file:/// e qualquer servidor web.
 * ====================================================================
 */
(function() {
    'use strict';
    window.RJ_PRODUCTS_DATA = ${JSON.stringify(products)};
})();
`;

fs.writeFileSync(jsOutputPath, jsContent, 'utf8');
console.log(`Arquivo gerado com sucesso: ${jsOutputPath}`);
console.log(`Tamanho do arquivo gerado: ${(fs.statSync(jsOutputPath).size / 1024).toFixed(1)} KB`);
