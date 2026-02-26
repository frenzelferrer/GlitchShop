class SlitchGhopStore {
    constructor() {
        this.balance = 300;
        this.inventory = [];
        this.flag = "YEM{Idd4c$_W1pf3t_Aa3j_1uTl7}";
        this.shopItems = {
            flag: { name: 'CAPTURE FLAG', emoji: '🚩', price: 676767, desc: 'The ultimate prize. Prove your worth.', rarity: 'LEGENDARY', color: 'yellow' },
            banana: { name: 'GOLDEN BANANA', emoji: '🍌', price: 50, desc: 'A perfectly ripe banana. Potassium included.', rarity: 'COMMON', color: 'yellow' },
            car: { name: 'SPORTS CAR', emoji: '🏎️', price: 100, desc: 'Vrooom! 0-100 in 2.5 seconds. Virtually.', rarity: 'EPIC', color: 'red' },
            mystery: { name: 'MYSTERY BOX', emoji: '📦', price: 200, desc: 'Could be anything. Probably nothing useful.', rarity: 'MYSTERY', color: 'purple' },
            coffee: { name: 'PREMIUM COFFEE', emoji: '☕', price: 75, desc: 'Dark roast. Extra strong. No refunds.', rarity: 'COMMON', color: 'amber' },
            decryptor: { name: 'DECRYPTOR KEY', emoji: '🔐', price: 95000, desc: 'Unlocks encrypted secrets.', rarity: 'RARE', color: 'pink' }
        };
        this.init();
    }

    init() {
        this.createParticles();
        this.renderShopItems();
        this.updateBalance();
        this.updateInventory();
        this.bindEvents();
    }

    createParticles() {
        const container = document.getElementById('particles');
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (15 + Math.random() * 10) + 's';
            container.appendChild(particle);
        }
    }

    renderShopItems() {
        const container = document.getElementById('shopItems');
        container.innerHTML = Object.entries(this.shopItems).map(([key, item]) => `
            <div class="glass-card rounded-xl p-5 item-card border border-${item.color}-500/20 hover:border-${item.color}-500/50 group">
                <div class="flex items-start justify-between mb-3">
                    <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-${item.color}-500/20 to-${item.color}-600/20 flex items-center justify-center text-2xl">
                        ${item.emoji}
                    </div>
                    <span class="px-3 py-1 rounded-full bg-${item.color}-500/10 text-${item.color}-400 text-xs font-bold border border-${item.color}-500/30">
                        ${item.rarity}
                    </span>
                </div>
                <h4 class="font-cyber font-bold text-lg text-${item.color}-400 mb-1">${item.name}</h4>
                <p class="text-gray-400 text-sm mb-4">${item.desc}</p>
                <div class="flex items-center justify-between">
                    <div class="text-xl font-cyber font-bold text-white">${item.price.toLocaleString()} <span class="text-sm text-purple-400">PHP</span></div>
                    <button data-buy="${key}" class="btn-cyber px-4 py-2 rounded-lg font-bold text-sm tracking-wide">
                        ACQUIRE
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateBalance() {
        const balanceEl = document.getElementById('balance');
        balanceEl.textContent = this.balance.toLocaleString();
        balanceEl.style.transform = 'scale(1.1)';
        setTimeout(() => balanceEl.style.transform = 'scale(1)', 200);
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');

        const colors = {
            success: 'border-green-500 bg-green-500/10',
            error: 'border-red-500 bg-red-500/10',
            info: 'border-cyan-500 bg-cyan-500/10',
            warning: 'border-yellow-500 bg-yellow-500/10'
        };

        toast.className = `toast glass-card rounded-lg p-4 border ${colors[type]} max-w-sm`;
        toast.innerHTML = `<p class="font-medium text-sm">${message}</p>`;

        container.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    logTransaction(action, amount, success) {
        const log = document.getElementById('transactionLog');
        const time = new Date().toLocaleTimeString();

        if (log.querySelector('.italic')) {
            log.innerHTML = '';
        }

        const entry = document.createElement('div');
        entry.className = `p-2 rounded-lg ${success ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`;
        entry.innerHTML = `
            <div class="flex justify-between items-center">
                <span class="${success ? 'text-green-400' : 'text-red-400'}">${action}</span>
                <span class="text-gray-500 text-xs">${time}</span>
            </div>
            <div class="text-xs text-gray-400">${amount} PHP</div>
        `;

        log.insertBefore(entry, log.firstChild);
    }

    withdraw() {
        const input = document.getElementById('withdrawAmount');
        const amount = parseFloat(input.value);

        if (isNaN(amount)) {
            this.showToast('Invalid amount entered!', 'error');
            return;
        }

        if (this.balance >= amount) {
            this.balance -= amount;
            this.updateBalance();
            this.logTransaction('WITHDRAW', amount, true);
            this.showToast(`Withdrew ${amount} PHP successfully!`, 'success');
            input.value = '';
        } else {
            this.logTransaction('WITHDRAW FAILED', amount, false);
            this.showToast('Insufficient balance!', 'error');
        }
    }

    buyItem(item) {
        const shopItem = this.shopItems[item];

        if (!shopItem) {
            this.showToast('Invalid item!', 'error');
            return;
        }

        const price = shopItem.price;

        if (this.balance >= price) {
            this.balance -= price;
            this.updateBalance();

            if (item === 'flag') {
                this.showFlagModal();
            }

            if (item === 'decryptor') {
                this.showDecryptorModal();
            }

            this.inventory.push({
                name: shopItem.name,
                emoji: shopItem.emoji
            });

            this.updateInventory();
            this.logTransaction(`BUY ${item.toUpperCase()}`, price, true);
            this.showToast(`Acquired ${item}!`, 'success');
        } else {
            this.logTransaction(`BUY FAILED`, price, false);
            this.showToast('Insufficient balance!', 'error');
        }
    }

    updateInventory() {
        const inv = document.getElementById('inventory');
        if (this.inventory.length === 0) {
            inv.innerHTML = '<div class="text-gray-500 italic">Empty...</div>';
        } else {
            inv.innerHTML = this.inventory.map(item => `
                <div class="glass-card px-4 py-2 rounded-lg border border-cyan-500/20 flex items-center gap-2 hover:border-cyan-500/50 transition-colors">
                    <span>${item.emoji}</span>
                    <span class="text-sm font-medium">${item.name}</span>
                </div>
            `).join('');
        }
    }

    showFlagModal() {
        const modal = document.getElementById('flagModal');
        document.getElementById('flagDisplay').textContent = this.flag;
        modal.classList.remove('modal-hidden');
        modal.classList.add('modal-visible');
    }

    showDecryptorModal() {
        const modal = document.getElementById('decryptorModal');
        document.getElementById('decryptorDisplay').innerHTML = `
            <p class="text-gray-400 text-sm mb-2">Cipher Type:</p>
            <p class="font-mono text-cyan-400 text-lg mb-4">Vigenère</p>
            <p class="text-gray-400 text-sm mb-2">Decryption Key:</p>
            <p class="font-mono text-green-400 text-lg">McgIsHere</p>
        `;
        modal.classList.remove('modal-hidden');
        modal.classList.add('modal-visible');
    }

    closeModal() {
        document.getElementById('flagModal').classList.add('modal-hidden');
        document.getElementById('flagModal').classList.remove('modal-visible');
    }

    closeDecryptorModal() {
        document.getElementById('decryptorModal').classList.add('modal-hidden');
        document.getElementById('decryptorModal').classList.remove('modal-visible');
    }

    bindEvents() {
        document.getElementById('withdrawBtn').addEventListener('click', () => this.withdraw());
        document.getElementById('closeModalBtn').addEventListener('click', () => this.closeModal());
        document.getElementById('closeDecryptorBtn').addEventListener('click', () => this.closeDecryptorModal());

        document.querySelectorAll('[data-buy]').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.dataset.buy;
                this.buyItem(item);
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.store = new SlitchGhopStore();
});