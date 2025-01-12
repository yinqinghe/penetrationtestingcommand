//src / utils / util.js;
export async function copyToClipboard(text) {
    if (navigator.clipboard) {
        try {
            await navigator.clipboard.writeText(text);
            return '文本已复制到剪贴板！';
        } catch (err) {
            console.error('无法复制文本: ', err);
            return fallbackCopyToClipboard(text); // 降级到备用方案
        }
    } else {
        return fallbackCopyToClipboard(text);
    }
}

export function fallbackCopyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed'; // 避免滚动到底部
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length); // 兼容移动设备
    try {
        const success = document.execCommand('copy');
        if (success) {
            console.log('文本已复制到剪贴板（备用方案）:', text);
            return '文本已复制到剪贴板！';
        } else {
            throw new Error('复制失败');
        }
    } catch (err) {
        console.error('无法复制文本: ', err);
        return '复制失败，请手动复制。';
    } finally {
        document.body.removeChild(textarea);
    }
}
export function updateCommands(commands, IP) {
    for (const category in commands) {
        for (const command in commands[category]) {
            commands[category][command] = commands[category][command].replace(/{{Attack_IP}}/g, IP);
        }
    }
}
export function resetCommands(commands, IP) {
    for (const category in commands) {
        for (const command in commands[category]) {
            commands[category][command] = commands[category][command].replace(new RegExp(IP, 'g'), '{{Attack_IP}}');
        }
    }
}

export function getSharedData(name) {
    const storedData = localStorage.getItem(name);
    if (storedData) {
        console.log('===', storedData);
        return storedData; // 解析 JSON 字符串并返回对象
    } else {
        console.log('localStorage 中没有 sharedData');
        return null; // 如果没有数据，返回 null
    }
}

export function checkSharedData(name) {
    const cookieValue = getSharedData(name);
    if (cookieValue) {
        console.log(`Cookie "${name}" 的值为: ${cookieValue}`);
        return JSON.parse(cookieValue); // 返回 Cookie 的值
    } else {
        console.log(`Cookie "${name}" 不存在`);
        return null; // 如果不存在，返回 null
    }
}
