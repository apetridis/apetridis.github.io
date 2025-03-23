// System Information Collection Functions
async function collectSystemInfo() {
    return {
        userAgent: navigator.userAgent,
        platform: navigator.userAgentData ? navigator.userAgentData.platform : 'Unknown',
        language: navigator.language,
        screen: `${window.screen.width}x${window.screen.height}`,
    };
}

async function getLocationInfo() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        return await response.json();
    } catch (error) {
        console.error('Error fetching location:', error);
        return null;
    }
}

// Terminal Class
class Terminal {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.typeSpeed = 50;
        this.prompt = 'root@cybersec';
        this.path = '~/reconnaissance';
        this.cursor = document.createElement('span');
        this.cursor.className = 'cursor';
        this.inputEnabled = false;
        this.currentInput = '';
        this.container.innerHTML = '';
        this.placeholder = 'Type something...';
        this.shouldShowPlaceholder = false;
        this.isFirstPrompt = true;

        // Set container style for proper scrolling
        this.container.style.overflow = 'auto';
        this.container.style.scrollBehavior = 'smooth';
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';

        this._initializeTerminal();
    }

    async _initializeTerminal() {
        this.cursor.remove(); // Ensure no cursor at start
        const promptLine = await this.showPrompt();
        await this.typeCommand(promptLine, './gather_intel.sh --target=client');
        await this.wait(500);

        // Remove cursor before writing output
        this.cursor.remove();
        
        this.writeOutput('⚡ Initializing reconnaissance module...', 'terminal-init');
        this.writeOutput('⚡ Establishing secure connection...', 'terminal-init');
        await this.wait(300);
        this.writeOutput('✔ Connection established successfully', 'terminal-success');
        await this.wait(500);

        const info = await collectSystemInfo();
        const locationInfo = await getLocationInfo();

        this.writeOutput('\n📊 SYSTEM INTELLIGENCE', 'section-title');
        this.writeOutput(`➜ Platform: ${info.platform}`, 'terminal-info');
        this.writeOutput(`➜ Browser: ${info.userAgent}`, 'terminal-info');
        this.writeOutput(`➜ Screen: ${info.screen} (${info.colorDepth}-bit)`, 'terminal-info');
        this.writeOutput(`➜ Language: ${info.language}`, 'terminal-info');

        if (locationInfo) {
            this.writeOutput('\n🌍 LOCATION INTELLIGENCE', 'section-title');
            this.writeOutput(`➜ IP Address: ${locationInfo.ip}`, 'terminal-info');
            this.writeOutput(`➜ City: ${locationInfo.city}`, 'terminal-info');
            this.writeOutput(`➜ Region: ${locationInfo.region}`, 'terminal-info');
            this.writeOutput(`➜ Country: ${locationInfo.country}`, 'terminal-info');
            this.writeOutput(`➜ Timezone: ${locationInfo.timezone}`, 'terminal-info');
            this.writeOutput(`➜ ISP: ${locationInfo.isp}`, 'terminal-info');
        }

        this.writeOutput('✔ Reconnaissance complete', 'terminal-success');
        this.shouldShowPlaceholder = true;  
        await this.wait(300);
        await this.showPrompt();
        this.enableInput();
    }

    enableInput() {
        if (!this.inputEnabled) {
            this.inputEnabled = true;
            document.addEventListener('keydown', this.handleKeyPress.bind(this));
        }
    }

    handleKeyPress(event) {
        if (!this.inputEnabled) return;

        event.preventDefault();

        switch(event.key) {
            case 'Enter':
                const command = this.currentInput;
                this.currentInput = '';
if (command.toLowerCase() === 'help') {
                    this.writeOutput('🛠️ Help is not available for this user. Sorry in the end you are not root! You are on your own!', 'terminal-info');
                } else {
                this.writeOutput(`🚫 Command not recognized (but can still be tracked): ${command}`, 'terminal-error');
                    this.writeOutput('💡 Pro tip: Type "help" if you\'re lost in the matrix.', 'terminal-info');
                }
                this.showPrompt();
                break;
            case 'Backspace':
                this.currentInput = this.currentInput.slice(0, -1);
                this.updateCurrentLine();
                break;
            default:
                if (event.key.length === 1) {
                    this.currentInput += event.key;
                    this.updateCurrentLine();
                }
                break;
        }
        this.scrollToBottom();
    }

    updateCurrentLine() {
        const currentLine = this.container.lastElementChild;
        const promptText = currentLine.querySelector('.terminal-prompt').textContent;
        currentLine.innerHTML = `<span class="terminal-prompt">${promptText}</span> `;
        
        if (this.currentInput) {
            currentLine.innerHTML += `<span class="terminal-input">${this.currentInput}</span>`;
        }
        
        currentLine.appendChild(this.cursor);
        this.scrollToBottom();
    }

    async showPrompt() {
        const promptLine = document.createElement('div');
        
        if (this.shouldShowPlaceholder) {
            promptLine.innerHTML = `<span class="terminal-prompt">${this.prompt}:${this.path}$</span> <span class="terminal-placeholder">${this.placeholder}</span>`;
            this.shouldShowPlaceholder = false;
        } else {
            promptLine.innerHTML = `<span class="terminal-prompt">${this.prompt}:${this.path}$</span> `;
        }
        
        this.container.appendChild(promptLine);
        promptLine.appendChild(this.cursor);
        this.scrollToBottom();
        return promptLine;
    }

    async typeCommand(line, command) {
        this.cursor.remove(); // Remove cursor while typing
        for (let char of command) {
            line.innerHTML += `<span class="terminal-command">${char}</span>`;
            this.scrollToBottom();
            await this.wait(this.typeSpeed);
        }
    }

    writeOutput(text, className) {
        this.cursor.remove(); // Remove cursor before adding new lines
        const line = document.createElement('div');
        line.innerHTML = `<span class="${className}">${text}</span>`;
        this.container.appendChild(line);
        this.scrollToBottom();
    }

    scrollToBottom() {
        // Using setTimeout to ensure DOM update is complete
        setTimeout(() => {
            const scrollHeight = this.container.scrollHeight;
            const animation = this.container.animate([
                { scrollTop: this.container.scrollTop },
                { scrollTop: scrollHeight }
            ], {
                duration: 300,
                easing: 'ease-out'
            });
            
            animation.onfinish = () => {
                this.container.scrollTop = scrollHeight;
            };
        }, 0);
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Security Demo Functions
function createInfoIcon(message) {
    return `
        <div class="info-icon">?
            <div class="tooltip">${message}</div>
        </div>
    `;
}

async function createWebcamDemo(container) {
    const demo = document.createElement('div');
    demo.className = 'risk-demo';
    demo.innerHTML = `
        ${createInfoIcon('Malicious websites can:<br>- Secretly record video<br>- Take snapshots without indication<br>- Use facial recognition<br>- Track movement patterns<br>- Enable surveillance')}
        <h3>📷 Webcam Access</h3>
        <div class="webcam-container">
            <video id="webcamFeed" autoplay playsinline></video>
        </div>
        <p class="warning">Malicious sites can silently access your camera</p>
    `;
    container.appendChild(demo);

    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        document.getElementById('webcamFeed').srcObject = stream;
    } catch (err) {
        demo.querySelector('.webcam-container').innerHTML = `
            <p class="error">Camera access denied</p>
        `;
    }
}

async function createClipboardDemo(container) {
    const demo = document.createElement('div');
    demo.className = 'risk-demo';
    demo.innerHTML = `
        ${createInfoIcon('Attackers can:<br>- Steal copied passwords<br>- Monitor sensitive data<br>- Replace copied content<br>- Track copy-paste patterns<br>- Exfiltrate clipboard history')}
        <h3>📋 Clipboard Access</h3>
        <div id="clipboardContent">Checking clipboard...</div>
        <p class="warning">Websites can read your clipboard data</p>
    `;
    container.appendChild(demo);

    try {
        const text = await navigator.clipboard.readText();
        document.getElementById('clipboardContent').innerHTML = `
            <p>Found in clipboard:</p>
            <code>${text || 'Empty clipboard'}</code>
        `;
    } catch (err) {
        document.getElementById('clipboardContent').innerHTML = `
            <p class="error">Clipboard access denied</p>
        `;
    }
}

async function createBehaviorDemo(container) {
    const demo = document.createElement('div');
    demo.className = 'risk-demo';
    demo.innerHTML = `
        ${createInfoIcon('Malicious sites can:<br>- Record typing patterns<br>- Track mouse movements<br>- Analyze behavior patterns<br>- Detect automation tools<br>- Profile user activity')}
        <h3>👥 User Behavior Tracking</h3>
        <div class="behavior-content">
            <div class="behavior-data"></div>
        </div>
        <p class="warning">Websites can track your movements and interactions!</p>
    `;
    container.appendChild(demo);

    const dataList = demo.querySelector('.behavior-data');
    const behaviors = [];

    // Track mouse movement across the entire document
    document.addEventListener('mousemove', (e) => {
        addBehavior(`Mouse position: ${e.clientX},${e.clientY}`);
    });

    document.addEventListener('keydown', (e) => {
        let actionText;
        switch(e.key) {
            case 'Enter':
                actionText = 'User submitted command';
                break;
            case 'Backspace':
                actionText = 'User deleted character';
                break;
            default:
                if (e.key.length === 1) {
                    actionText = `Key pressed: ${e.key}${getModifiers(e)}`;
                }
        }
        if (actionText) {
            addBehavior(actionText);
        }
    });

    function getModifiers(e) {
        const mods = [];
        if (e.shiftKey) mods.push('Shift');
        if (e.ctrlKey) mods.push('Ctrl');
        if (e.altKey) mods.push('Alt');
        return mods.length ? ` (${mods.join('+')})` : '';
    }

    function addBehavior(data) {
        const time = new Date().toLocaleTimeString();
        behaviors.unshift(`[${time}] ${data}`);
        if (behaviors.length > 5) behaviors.pop();
        dataList.innerHTML = behaviors.map(b => `<div class="behavior-entry">${b}</div>`).join('');
    }
}

async function createSensorsDemo(container) {
    const demo = document.createElement('div');
    demo.className = 'risk-demo';
    demo.innerHTML = `
        ${createInfoIcon('Attackers can access:<br>- Device orientation<br>- Motion patterns<br>- Physical movement<br>- Environmental data<br>- Location estimation')}
        <h3>📱 Device Sensors</h3>
        <div id="sensorContent">
            <ul class="sensor-data"></ul>
        </div>
        <p class="warning">Websites can access your device sensors</p>
    `;
    container.appendChild(demo);

    const dataList = demo.querySelector('.sensor-data');

    try {
        window.addEventListener('deviceorientation', (e) => {
            dataList.innerHTML = `
                <li>Tilt Front/Back: ${Math.round(e.beta)}°</li>
                <li>Tilt Left/Right: ${Math.round(e.gamma)}°</li>
                <li>Compass: ${Math.round(e.alpha)}°</li>
            `;
        });

        window.addEventListener('devicemotion', (e) => {
            const acceleration = e.accelerationIncludingGravity;
            if (acceleration) {
                dataList.innerHTML += `
                    <li>Acceleration X: ${Math.round(acceleration.x)}</li>
                    <li>Acceleration Y: ${Math.round(acceleration.y)}</li>
                    <li>Acceleration Z: ${Math.round(acceleration.z)}</li>
                `;
            }
        });
    } catch (err) {
        dataList.innerHTML = '<li>Sensor access not available</li>';
    }
}

// Main Security Demo Function
async function demonstratePhishing() {
    const additionalRisks = document.getElementById('additional-risks');
    if (!additionalRisks) return;

    additionalRisks.innerHTML = '';
    const demoContainer = document.createElement('div');
    demoContainer.className = 'demo-container';
    additionalRisks.appendChild(demoContainer);

    await Promise.all([
        createWebcamDemo(demoContainer),
        createClipboardDemo(demoContainer),
        createBehaviorDemo(demoContainer),
        createSensorsDemo(demoContainer)
    ]);
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    const terminal = new Terminal('userInfo');
    demonstratePhishing();
});