#!/usr/bin/env node
// 本地 aeon skill runner —— 不依赖 GitHub Actions
// 用法: node run-aeon-skill.js <skill> [var]
// 例:   node run-aeon-skill.js heartbeat
//       node run-aeon-skill.js token-pick "AI tokens"
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const AEON_ROOT = 'D:/deepseek harness/aeon';
const skill = process.argv[2];
const vari = process.argv.slice(3).join(' ');

if (!skill) {
    console.error('用法: node run-aeon-skill.js <skill> [var]');
    process.exit(1);
}

const skillDir = path.join(AEON_ROOT, 'skills', skill);
const skillMd = path.join(skillDir, 'SKILL.md');
if (!fs.existsSync(skillMd)) {
    console.error(`❌ 找不到 skill: ${skill}（${skillMd}）`);
    process.exit(1);
}

// 读 SKILL.md 头部拿 requires（检查关键依赖）
const head = fs.readFileSync(skillMd, 'utf8').slice(0, 2000);
const requires = (head.match(/requires:\s*[\s\S]*?\n\s*(?:capabilities|metadata|tags|mode|var|description)/) || [null])[0];
console.log(`▶ 运行 skill: ${skill}${vari ? `  (var: ${vari})` : ''}`);
console.log('  SKILL.md:', skillMd);

// 环境变量（DeepSeek 网关已持久化，这里兜底再设一次）
const env = { ...process.env };
if (!env.ANTHROPIC_API_KEY) {
    try {
        const envFile = fs.readFileSync('C:/Users/ASUS/AppData/Local/hermes/.env', 'utf8');
        const m = envFile.split(/\r?\n/).find(l => l.startsWith('DEEPSEEK_API_KEY='));
        if (m) env.ANTHROPIC_API_KEY = m.split('=').slice(1).join('=').trim();
    } catch (e) {}
}
env.ANTHROPIC_BASE_URL = env.ANTHROPIC_BASE_URL || 'https://api.deepseek.com/anthropic';
env.ANTHROPIC_MODEL = env.ANTHROPIC_MODEL || 'deepseek-chat';
env.CLAUDE_CODE_DISABLE_UNKNOWN_MODEL_WINDOW_ENFORCEMENT = '1';

// 构造 skill 运行提示（对齐 aeon 的 dispatch 语义）
const prompt = `Run the skill "${skill}"${vari ? ` with var: "${vari}"` : ''}. Read skills/${skill}/SKILL.md and follow it exactly.`;

// claude-code 权限：本地可信环境放行网络/工具（curl/WebFetch/WebSearch/Bash），
// 加 --max-turns 上限防失控。--allowedTools 白名单优先，缺失时兜底 bypass。
const claudeArgs = [
    '-p', prompt,
    '--allowedTools', 'Bash,WebFetch,WebSearch,Read,Write,Edit,Task,Glob,Grep,TodoWrite',
    '--max-turns', '60',
];

console.log('⏳ claude 运行中（可能 1-10 分钟）...');
const started = Date.now();
try {
    const out = execSync('claude ' + claudeArgs.map(a => JSON.stringify(a)).join(' '), {
        cwd: AEON_ROOT,
        env,
        encoding: 'utf8',
        timeout: 20 * 60 * 1000, // 20 分钟上限
        maxBuffer: 20 * 1024 * 1024,
        stdio: ['ignore', 'pipe', 'pipe'],
    });
    const secs = Math.round((Date.now() - started) / 1000);
    console.log(`\n✅ 完成（${secs}s）—— 输出：\n${'='.repeat(60)}`);
    // 过滤 claude 的警告噪音行
    const lines = out.split('\n').filter(l => !l.startsWith('[claude-code:') && !l.includes('not a model this version of Claude Code recognizes'));
    const clean = lines.join('\n').trim();
    console.log(clean);

    // 播报桥接：把本次输出写入 Pulse 通知流（aeon 板块显示）
    try {
        const pulseFile = 'C:/Users/ASUS/Documents/Codex/2026-08-16/gei-w/.pulse-local/aeon_notifications.jsonl';
        const note = {
            ts: new Date().toISOString(),
            skill,
            title: `本地运行 · ${vari ? `var=${vari}` : 'completed'}`,
            text: clean.slice(0, 800),
        };
        require('fs').appendFileSync(pulseFile, JSON.stringify(note) + '\n', 'utf8');
        console.log('\n📡 播报已写入 Pulse（aeon 板块）');
    } catch (e) {
        console.log('\n⚠️ 播报写入 Pulse 失败:', e.message);
    }
    return clean;
} catch (e) {
    const secs = Math.round((Date.now() - started) / 1000);
    console.error(`\n❌ 运行失败（${secs}s）`);
    if (e.stdout) console.error('输出:', String(e.stdout).slice(-3000));
    if (e.stderr) console.error('stderr:', String(e.stderr).slice(-1500));
    process.exit(1);
}
