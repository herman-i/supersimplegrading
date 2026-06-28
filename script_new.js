const data = [
    {
        category: "Supraventriculair",
        cssClass: "bg-light-green",
        items: [
            { text: "Sporadisch een SVES" },
            { text: "Af en toe een SVES" },
            { text: "Regelmatig een SVES met burden > 5%" },
            { text: "Er is sprake van een enkele paroxysmale atriale tachycardie (PAT)." },
            { 
                text: "Er werd (paroxysmaal) atriumfibrilleren of -flutter gevonden.",
                triggers: ["choice_3", "choice_4"]
            },
            { 
                text: "Geen ritme- of geleidingsstoornissen van betekenis gevonden.",
                triggers: ["choice_1"]
            },
            { text: "Er werd een bradycardie gevonden." },
            { text: "Tijdens klachten met name sinusritme of -tachycardie." },
            { text: "Er was sprake van een eerstegraads AV block" },
            { text: "Er was sprake van een tweedegraads AV block type Wenckebach (Mobitz 1)" },
            { 
                text: "Er was sprake van een tweedegraads AV block type Mobitz 2",
                triggers: ["choice_3", "choice_4"]
            }
        ]
    },
    {
        category: "Ventriculair",
        cssClass: "bg-light-yellow",
        items: [
            { text: "Sporadisch een VES." },
            { text: "Af en toe een VES." },
            { 
                text: "Frequente VES, burden boven de norm.",
                triggers: ["choice_3", "choice_4"]
            },
            { text: "Er werden een of enkele doubletten gezien." },
            { 
                text: "Er werden een of enkele tripletten gezien met lang koppelingsinterval.",
                triggers: ["choice_2", "choice_4"]
            },
            { 
                text: "Er werden een of enkele tripletten gezien met een multiform patroon.",
                triggers: ["choice_3", "choice_4"]
            },
            { 
                text: "Er was sprake van een (non-)sustained ventriculaire tachycardie (VT).",
                triggers: ["choice_3", "choice_4"]
            }
        ]
    },
    {
        category: "Advies",
        cssClass: "bg-light-blue",
        items: [
            { 
                text: "Advies: sluit een lichamelijke oorzaak als hyperthyreoidie uit. Adviseer patiënt alle caffeïnehoudend voedsel of drank te vermijden (koffie, thee, chocolade), geen drugs te gebruiken en mentale stress te vermijden. Bij aanhoudende klachten kan symptomatisch starten van een betablocker worden overwogen.",
                triggers: ["choice_1"]
            },
            { 
                text: "Beoordeeld als graad 1: op basis van dit Holteronderzoek is er geen sprake van een verwijsindicatie.",
                id: "choice_1"
            },
            { 
                text: "Beoordeeld als graad 2: op basis van dit Holteronderzoek adviseren wij een digitaal eenmalig consult medisch specialist (ECMSD) / meekijkconsult bij de cardioloog.",
                id: "choice_2",
                triggers: ["choice_4"],
                untriggers: ["choice_1"]
            },
            { 
                text: "Beoordeeld als graad 3: op basis van dit Holteronderzoek is er sprake van een verwijsindicatie.",
                id: "choice_3",
                triggers: ["choice_4"],
                untriggers: ["choice_1", "choice_2"]
            },
            { 
                text: "Gaarne deze uitslag inclusief stroken meesturen met uw verwijzing.",
                id: "choice_4"
            }
        ]
    }
];

const leftPane = document.getElementById('left-pane');
const textBox = document.getElementById('text-box');
const copyButton = document.getElementById('copy-button');
const resetButton = document.getElementById('reset-button');

// Trigger tracking
const triggerSources = {}; // { targetLogicId: Set<sourceDomId> }
const autoTriggeredSet = new Set(); // logicIds that were auto-triggered
let isProcessingTriggers = false;

// Render the checkboxes
data.forEach((section, sectionIndex) => {
    const sectionContainer = document.createElement('div');
    sectionContainer.classList.add('category-section');
    if (section.cssClass) {
        sectionContainer.classList.add(section.cssClass);
    }

    const sectionHeader = document.createElement('h3');
    sectionHeader.textContent = section.category;
    sectionContainer.appendChild(sectionHeader);

    section.items.forEach((item, itemIndex) => {
        const container = document.createElement('div');
        container.classList.add('checkbox-container');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        // Create a unique ID for the DOM element
        const domId = `cb-${sectionIndex}-${itemIndex}`;
        checkbox.id = domId;
        checkbox.value = item.text;
        
        // Store logic IDs and triggers as data attributes for easy access
        if (item.id) {
            checkbox.dataset.logicId = item.id;
        }
        if (item.triggers) {
            checkbox.dataset.triggers = JSON.stringify(item.triggers);
        }
        if (item.untriggers) {
            checkbox.dataset.untriggers = JSON.stringify(item.untriggers);
        }

        const label = document.createElement('label');
        label.htmlFor = domId;
        label.appendChild(document.createTextNode(item.text));

        container.appendChild(checkbox);
        container.appendChild(label);
        sectionContainer.appendChild(container);

        checkbox.addEventListener('change', (e) => {
            if (!isProcessingTriggers && e.target.dataset.logicId) {
                // Manual change on a grade item - clear auto-trigger status
                if (e.target.checked) {
                    autoTriggeredSet.delete(e.target.dataset.logicId);
                }
            }
            handleTriggers(e.target);
            enforceGradeDependencies();
            updateTextBox();
        });
    });

    leftPane.appendChild(sectionContainer);
});

function handleTriggers(sourceCheckbox) {
    if (sourceCheckbox.checked) {
        // First handle untriggers (uncheck conflicting items)
        if (sourceCheckbox.dataset.untriggers) {
            const untriggers = JSON.parse(sourceCheckbox.dataset.untriggers);
            untriggers.forEach(targetId => {
                const targetCheckbox = document.querySelector(`input[data-logic-id="${targetId}"]`);
                if (targetCheckbox && targetCheckbox.checked) {
                    isProcessingTriggers = true;
                    targetCheckbox.checked = false;
                    isProcessingTriggers = false;
                    autoTriggeredSet.delete(targetId);
                    if (targetCheckbox.dataset.triggers) {
                        removeTriggers(targetCheckbox);
                    }
                }
            });
        }
        // Then handle triggers (check related items)
        if (sourceCheckbox.dataset.triggers) {
            const triggers = JSON.parse(sourceCheckbox.dataset.triggers);
            triggers.forEach(targetId => {
                if (!triggerSources[targetId]) {
                    triggerSources[targetId] = new Set();
                }
                triggerSources[targetId].add(sourceCheckbox.id);

                const targetCheckbox = document.querySelector(`input[data-logic-id="${targetId}"]`);
                if (targetCheckbox && !targetCheckbox.checked) {
                    isProcessingTriggers = true;
                    targetCheckbox.checked = true;
                    isProcessingTriggers = false;
                    autoTriggeredSet.add(targetId);
                    handleTriggers(targetCheckbox);
                }
            });
        }
    } else {
        // Checkbox unchecked - remove its trigger contributions
        if (sourceCheckbox.dataset.triggers) {
            removeTriggers(sourceCheckbox);
        }
    }
}

function removeTriggers(sourceCheckbox) {
    const triggers = JSON.parse(sourceCheckbox.dataset.triggers);
    triggers.forEach(targetId => {
        if (triggerSources[targetId]) {
            triggerSources[targetId].delete(sourceCheckbox.id);
            if (triggerSources[targetId].size === 0) {
                delete triggerSources[targetId];
                const targetCheckbox = document.querySelector(`input[data-logic-id="${targetId}"]`);
                if (targetCheckbox && targetCheckbox.checked && autoTriggeredSet.has(targetId)) {
                    isProcessingTriggers = true;
                    targetCheckbox.checked = false;
                    isProcessingTriggers = false;
                    autoTriggeredSet.delete(targetId);
                    // Cascade: remove triggers from the unchecked target
                    if (targetCheckbox.dataset.triggers) {
                        removeTriggers(targetCheckbox);
                    }
                }
            }
        }
    });
}

function enforceGradeDependencies() {
    const grade2 = document.querySelector('input[data-logic-id="choice_2"]');
    const grade3 = document.querySelector('input[data-logic-id="choice_3"]');
    const sendStrips = document.querySelector('input[data-logic-id="choice_4"]');

    if (sendStrips && sendStrips.checked && !grade2.checked && !grade3.checked) {
        isProcessingTriggers = true;
        sendStrips.checked = false;
        isProcessingTriggers = false;
        autoTriggeredSet.delete("choice_4");
        delete triggerSources["choice_4"];
    }
}

function updateTextBox() {
    let content = '';
    const checkboxes = document.querySelectorAll('#left-pane input[type="checkbox"]');
    checkboxes.forEach(cb => {
        if (cb.checked) {
            content += cb.value + '\r\n\r\n';
        }
    });
    textBox.value = content;
}

copyButton.addEventListener('click', () => {
    textBox.select();
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textBox.value)
            .then(() => {
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = 'Copy to Clipboard';
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text with modern API: ', err);
                try {
                    const successful = document.execCommand('copy');
                    if (successful) {
                        copyButton.textContent = 'Copied!';
                        setTimeout(() => {
                            copyButton.textContent = 'Copy to Clipboard';
                        }, 2000);
                    } else {
                        copyButton.textContent = 'Copy Failed';
                    }
                } catch (err) {
                    console.error('Fallback copy failed: ', err);
                    copyButton.textContent = 'Copy Failed';
                }
            });
    } else {
        try {
            const successful = document.execCommand('copy');
            if (successful) {
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = 'Copy to Clipboard';
                }, 2000);
            } else {
                copyButton.textContent = 'Copy Failed';
            }
        } catch (err) {
            console.error('Fallback copy failed: ', err);
            copyButton.textContent = 'Copy Failed';
        }
    }
});

resetButton.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('#left-pane input[type="checkbox"]');
    checkboxes.forEach(cb => {
        cb.checked = false;
    });
    // Clear trigger tracking state
    Object.keys(triggerSources).forEach(key => delete triggerSources[key]);
    autoTriggeredSet.clear();
    updateTextBox();
});
