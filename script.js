const storyBox = document.getElementById('story-box');
const inputArea = document.getElementById('input-area');
const commandInput = document.getElementById('command-input');

let currentNodeId = 1;
let isTyping = false;

// Helper to wait a bit
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function typeStory(text) {
    isTyping = true;
    storyBox.innerHTML = '';
    inputArea.classList.add('hidden');

    // Type out the story
    const chars = text.split('');
    for (let char of chars) {
        if (char === '\n') {
            storyBox.innerHTML += '<br>';
        } else {
            storyBox.innerHTML += char;
        }
        await sleep(15); // typing speed
    }

    isTyping = false;
    inputArea.classList.remove('hidden');
    commandInput.focus();
    storyBox.scrollTop = storyBox.scrollHeight;
}

function handleInput(event) {
    if (event.key === 'Enter' && !isTyping) {
        let input = commandInput.value.trim().toLowerCase();

        // Don't process empty input
        if (!input) return;

        commandInput.value = '';

        const node = storyNodes.find(n => n.id === currentNodeId);
        if (!node) return;

        let foundOption = null;
        for (let option of node.options) {
            // Check if any of the accepted commands match the user input
            // We use includes so they can type "napsat git init" and it still works if "git init" is in commands
            // Or exact match depending on logic. Let's look for substring match.
            if (option.commands.some(cmd => input.includes(cmd.toLowerCase()))) {
                foundOption = option;
                break;
            }
        }

        if (foundOption) {
            if (foundOption.nextText <= 0) {
                startGame();
            } else {
                startStoryNode(foundOption.nextText);
            }
        } else {
            // Unrecognized command
            const htmlInput = input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            const errorMsg = `<br><br><span style="color: #f85149;">$ ${htmlInput}<br>Příkaz neznámý. Zkus si přečíst možnosti v textu a napsat co se od tebe žádá (např. 'git status' nebo 'hledat').</span>`;
            storyBox.innerHTML += errorMsg;
            storyBox.scrollTop = storyBox.scrollHeight;
        }
    }
}

commandInput.addEventListener('keypress', handleInput);

// Keep focus on input when clicking anywhere on the game container
document.querySelector('.game-container').addEventListener('click', () => {
    if (!isTyping) {
        commandInput.focus();
    }
});

async function startStoryNode(nodeId) {
    currentNodeId = nodeId;
    const node = storyNodes.find(n => n.id === nodeId);
    if (!node) {
        console.error("Node not found:", nodeId);
        return;
    }

    await typeStory(node.text);
}

function startGame() {
    startStoryNode(1);
}

// Our story data structure mapping commands to next steps
const storyNodes = [
    {
        id: 1,
        text: "Píše se rok 2024. Sedíš u svého počítače s hrnkem vlažného kafe. Tvé poslání je jasné: musíš vytvořit svůj první Git commit a pushnout ho na GitHub. Pokud selžeš, tvůj kód se ztratí v propadlišti dějin.\n\nMožnosti:\n- Zjistit stav (napiš 'git status')\n- Hledat radu (napiš 'hledat' nebo 'google')\n- Ignorovat to (napiš 'hrat' nebo 'minesweeper')\n\nJaký bude tvůj první krok?",
        options: [
            { commands: ["git status", "status"], nextText: 2 },
            { commands: ["hledat", "google", "pomoc", "jak na to"], nextText: 3 },
            { commands: ["hrat", "minesweeper", "ignorovat", "nic"], nextText: 4 }
        ]
    },
    {
        id: 2,
        text: "Terminál na tebe zlověstně mrká.\n\nfatal: not a git repository (or any of the parent directories): .git\n\nAha. Možná by stálo za to to nejdřív inicializovat, génie.\n\nMožnosti:\n- Inicializovat repozitář (napiš 'git init')\n- Začít brečet (napiš 'brecet')",
        options: [
            { commands: ["git init", "init"], nextText: 5 },
            { commands: ["brecet", "brečet", "plakat", "zavolat"], nextText: 6 }
        ]
    },
    {
        id: 3,
        text: "Prohlížeč se otevřel.\nStackOverflow ti radí napřed stáhnout instalátor. Stahuješ a proklikáváš 'Next' tak rychle, jak jen to jde, aniž bys četl, jestli ti to náhodou nenainstaluje i McAfee Antivirus.\nGit je nainstalován!\n\nMožnosti:\n- Otevřít terminál a zkusit to znovu (napiš 'git status' nebo 'znovu')",
        options: [
            { commands: ["git status", "status", "znovu", "terminal"], nextText: 2 }
        ]
    },
    {
        id: 4,
        text: "Šlápl jsi na minu. Tvůj disk crashnul a všechny nedokončené projekty navždy zmizely. Zítra si zkusíš najít práci jako pastýř ovcí.\n\nKONEC HRY.\n\nNapiš 'restart' pro novou hru.",
        options: [
            { commands: ["restart", "znovu", "ano"], nextText: -1 }
        ]
    },
    {
        id: 5,
        text: "Initialized empty Git repository in /Users/ty/projekty/super-tajny-projekt/.git/\n\nSkvělé! Teď máš prázdný repozitář. Ale potřebuješ do něj něco dát.\n\nMožnosti:\n- Vytvořit soubor (napiš 'vytvorit index.html')\n- Přidat adresář memů (napiš 'git add .')",
        options: [
            { commands: ["vytvorit index.html", "vytvorit index", "vytvořit index", "index.html"], nextText: 7 },
            { commands: ["git add .", "git add", "memy", "memes"], nextText: 8 }
        ]
    },
    {
        id: 6,
        text: "Máma ti řekne, ať si najdeš pořádné kamarády a nezíráš furt do toho kompjůtru. Nepomohla ti s Gitem.\n\nKONEC HRY.\n\nNapiš 'restart' pro novou hru.",
        options: [
            { commands: ["restart", "znovu", "ano"], nextText: -1 }
        ]
    },
    {
        id: 7,
        text: "Soubor je vytvořen! Je čas ho přidat a commitnout.\n\nMožnosti:\n- Napsat rovnou commitovací příkaz (napiš 'git commit -m \"Prvni commit\"')\n- Napsat napřed příkaz na přidání souboru (napiš 'git add index.html')",
        options: [
            { commands: ["git commit -m", "git commit"], nextText: 9 },
            { commands: ["git add index.html", "git add index", "git add"], nextText: 10 }
        ]
    },
    {
        id: 8,
        text: "Přidal jsi 4 gigabyty memů. Tvůj počítač teď funí jak astmatik do kopce. Při snaze to pushnout se GitHub rozpláče a zablokuje ti účet.\n\nKONEC HRY.\n\nNapiš 'restart' pro novou hru.",
        options: [
            { commands: ["restart", "znovu", "ano"], nextText: -1 }
        ]
    },
    {
        id: 9,
        text: "On branch master\nUntracked files:\n  (use \"git add <file>...\" to include in what will be committed)\n\tindex.html\n\nnothing added to commit but untracked files present\n\nGit na tebe křičí, že jsi soubor nepřidal. Kdo by to byl čekal.\n\nMožnosti:\n- Zařadit zpátečku a přidat všechny soubory (napiš 'git add .')",
        options: [
            { commands: ["git add .", "git add"], nextText: 10 }
        ]
    },
    {
        id: 10,
        text: "Úspěch!\n[master (root-commit) 8b9g7f6] Přidáno.\n\nNyní je třeba to commitnout!\n\nMožnosti:\n- Commit (napiš 'git commit -m \"Prvni commit\"')",
        options: [
            { commands: ["git commit -m", "git commit", "commit"], nextText: 105 }
        ]
    },
    {
        id: 105,
        text: "1 file changed, 10 insertions(+)\n\nTeď přichází ta nejtěžší část. Spojit to s GitHubem.\n\nMožnosti:\n- Propojit s remote repozitářem (napiš 'git remote add origin https://...git')",
        options: [
            { commands: ["git remote add origin", "git remote", "remote", "origin"], nextText: 11 }
        ]
    },
    {
        id: 11,
        text: "Propojeno! Teď zkusíme ten slavný 'push'.\n\nMožnosti:\n- Odeslat na server (napiš 'git push -u origin master' nebo jen 'git push')",
        options: [
            { commands: ["git push -u origin master", "git push origin master", "git push", "push"], nextText: 12 }
        ]
    },
    {
        id: 12,
        text: "Username for 'https://github.com':\n\nSakra. Zapomněl jsi, jak se jmenuješ na GitHubu. A co heslo?!\n\nMožnosti:\n- Zadat běžné heslo k pamatování (napiš 'zadat heslo')\n- Použít obezřetně uložený Personal Access Token (napiš 'zadat token' nebo 'token')",
        options: [
            { commands: ["heslo", "zadat heslo", "password"], nextText: 13 },
            { commands: ["token", "pat", "zadat token", "osobni pridupovy token"], nextText: 14 }
        ]
    },
    {
        id: 13,
        text: "remote: Support for password authentication was removed on August 13, 2021.\nfatal: Authentication failed\n\nVílí prach a jednorožci ti nepomůžou. Hesla už se nenosí. Vítej v budoucnosti, babičko.\n\nMožnosti:\n- Jít vygenerovat a zadat Token (napiš 'zadat token' nebo 'token')",
        options: [
            { commands: ["token", "pat", "zadat token"], nextText: 14 }
        ]
    },
    {
        id: 14,
        text: "Zadáváš tunu generických znaků (ghp_xYz123BlahBlah)...\n\nEnumerating objects: 3, done.\nCounting objects: 100% (3/3), done.\nWriting objects: 100% (3/3), 200 bytes | 200.00 KiB/s, done.\nTo https://github.com/hax0r/moje-veci.git\n * [new branch]      master -> master\n\nJe to tam! Tvé mistrovské dílo (prázdný index.html) je bezpečně uloženo v cloudu Microsoftu!\n\nMožnosti:\n- Oslavit to (napiš 'slavit' nebo 'oslaj')!",
        options: [
            { commands: ["slavit", "oslava", "konec", "vyhra", "jupi", "oslaj"], nextText: 15 }
        ]
    },
    {
        id: 15,
        text: "GRATULUJEME!\n\nÚspěšně jsi překonal nástrahy terminálu, ignoroval jsi svou mámu, nenainstaloval sis viry a tvůj kód je online.\n\nNyní tvůj Github profil svítí jednou krásnou zelenou tečkou. Jsi na nejlepší cestě vyhořet do 30 let!\n\nVÍTĚZSTVÍ!\n\nMožnosti:\n- Hrát znovu (napiš 'restart')",
        options: [
            { commands: ["restart", "znovu", "hrat znovu", "ano"], nextText: -1 }
        ]
    }
];

// Start the game!
startGame();
