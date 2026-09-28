/**
 * Suíte de Testes Unitários — Fase 3: Motor de Conversão WhatsApp
 * Executado via Node.js
 */

const assert = require("assert");
const { WHATSAPP_CONFIG } = require("../js/whatsapp-cta.js");

console.log("==========================================================");
console.log(" INICIANDO TESTES UNITÁRIOS — FASE 3: MOTOR WHATSAPP     ");
console.log("==========================================================");

let passed = 0;
let failed = 0;

function runTest(name, fn) {
    try {
        fn();
        console.log(`  \x1b[32m[PASS]\x1b[0m ${name}`);
        passed++;
    } catch (err) {
        console.error(`  \x1b[31m[FAIL]\x1b[0m ${name}: ${err.message}`);
        failed++;
    }
}

// 1. Testes de Configuração
runTest("WHATSAPP_CONFIG está definido e é um objeto", () => {
    assert.strictEqual(typeof WHATSAPP_CONFIG, "object");
    assert.ok(WHATSAPP_CONFIG !== null);
});

runTest("phoneNumber padrão está preenchido", () => {
    assert.ok(WHATSAPP_CONFIG.phoneNumber);
    assert.strictEqual(typeof WHATSAPP_CONFIG.phoneNumber, "string");
});

// 2. Testes de Sanitização de Telefone
runTest("Sanitização de número com formatação complexa (+55 (11) 98765-4321)", () => {
    const original = WHATSAPP_CONFIG.phoneNumber;
    try {
        WHATSAPP_CONFIG.phoneNumber = "+55 (11) 98765-4321";
        assert.strictEqual(WHATSAPP_CONFIG.getCleanPhoneNumber(), "5511987654321");
    } finally {
        WHATSAPP_CONFIG.phoneNumber = original;
    }
});

runTest("Sanitização de número já limpo (5511999999999)", () => {
    const original = WHATSAPP_CONFIG.phoneNumber;
    try {
        WHATSAPP_CONFIG.phoneNumber = "5511999999999";
        assert.strictEqual(WHATSAPP_CONFIG.getCleanPhoneNumber(), "5511999999999");
    } finally {
        WHATSAPP_CONFIG.phoneNumber = original;
    }
});

// 3. Testes de Geração de Mensagem (buildMessage)
runTest("Geração de mensagem com nome de produto real com acentos", () => {
    const productName = "Sofá Retrátil Reclinável Lima 2,00m Linho Cinza A59 - Sem Caixa";
    const msg = WHATSAPP_CONFIG.buildMessage(productName);
    assert.ok(msg.includes(`*${productName}*`));
    assert.ok(msg.startsWith("Olá! Vi o catálogo"));
});

runTest("Geração de mensagem remove espaços em branco nas extremidades", () => {
    const msg = WHATSAPP_CONFIG.buildMessage("   Mesa de Jantar Elegance 6 Cadeiras   ");
    assert.ok(msg.includes("*Mesa de Jantar Elegance 6 Cadeiras*"));
});

runTest("Fallback para string vazia", () => {
    const msg = WHATSAPP_CONFIG.buildMessage("");
    assert.strictEqual(msg, WHATSAPP_CONFIG.fallbackMessage);
});

runTest("Fallback para valor null ou undefined", () => {
    assert.strictEqual(WHATSAPP_CONFIG.buildMessage(null), WHATSAPP_CONFIG.fallbackMessage);
    assert.strictEqual(WHATSAPP_CONFIG.buildMessage(undefined), WHATSAPP_CONFIG.fallbackMessage);
});

// 4. Testes de Construção da URL Final (buildUrl)
runTest("Estrutura da URL começa com protocolo oficial wa.me", () => {
    const url = WHATSAPP_CONFIG.buildUrl("Poltrona Decorativa");
    assert.ok(url.startsWith("https://wa.me/"));
});

runTest("Codificação correta de caracteres especiais e acentuação no parâmetro ?text=", () => {
    const productName = "Sofá Retrátil 2,00m com Mola Bonnel & Veludo";
    const url = WHATSAPP_CONFIG.buildUrl(productName);
    
    // Não pode conter espaços literais ou caracteres brutos que quebrem a URL
    assert.ok(!url.includes(" "));
    assert.ok(url.includes("?text="));
    
    // Ao decodificar a query string, o texto original deve ser recuperado com perfeição
    const queryText = url.split("?text=")[1];
    const decoded = decodeURIComponent(queryText);
    assert.ok(decoded.includes(productName));
});

runTest("Número correto é inserido no path da URL", () => {
    const original = WHATSAPP_CONFIG.phoneNumber;
    try {
        WHATSAPP_CONFIG.phoneNumber = "5511988887777";
        const url = WHATSAPP_CONFIG.buildUrl("Aparador");
        assert.ok(url.startsWith("https://wa.me/5511988887777?text="));
    } finally {
        WHATSAPP_CONFIG.phoneNumber = original;
    }
});

console.log("==========================================================");
console.log(` RESULTADO: Total: ${passed + failed} | Aprovados: ${passed} | Falhas: ${failed}`);
console.log("==========================================================");

if (failed > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
