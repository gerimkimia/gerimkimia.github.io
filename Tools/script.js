// Custom Alert Function
function showCustomAlert(message, title = 'Peringatan') {
    const overlay = document.getElementById('custom-alert-overlay');
    const messageEl = document.querySelector('.custom-alert-message');
    const titleEl = document.querySelector('.custom-alert-title');
    
    titleEl.textContent = title;
    messageEl.textContent = message;
    
    overlay.classList.add('show');
}

function closeCustomAlert() {
    const overlay = document.getElementById('custom-alert-overlay');
    overlay.classList.remove('show');
}

// Setup event listeners for custom alert (only once)
document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('custom-alert-overlay');
    
    // Close on overlay click
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeCustomAlert();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.classList.contains('show')) {
            closeCustomAlert();
        }
    });
});

// Chemistry Calculator Class
class ChemistryCalculator {
    constructor() {
        // Massa atom relatif (Ar) unsur-unsur
        this.atomic_mass = {
            'H': 1, 'He': 4, 'Li': 7, 'Be': 9, 'B': 11, 'C': 12, 'N': 14, 'O': 16, 
            'F': 19, 'Ne': 20, 'Na': 23, 'Mg': 24, 'Al': 27, 'Si': 28, 'P': 31, 
            'S': 32, 'Cl': 35.5, 'Ar': 40, 'K': 39, 'Ca': 40, 'Sc': 45, 'Ti': 48,
            'V': 51, 'Cr': 52, 'Mn': 55, 'Fe': 56, 'Co': 59, 'Ni': 59, 'Cu': 64,
            'Zn': 65, 'Ga': 70, 'Ge': 73, 'As': 75, 'Se': 79, 'Br': 80, 'Kr': 84,
            'Rb': 85, 'Sr': 88, 'Ag': 108, 'Cd': 112, 'Sn': 119, 'I': 127, 'Xe': 131,
            'Ba': 137, 'Au': 197, 'Hg': 201, 'Pb': 207, 'Bi': 209, 'Ra': 226, 'U': 238
        };
        
        // Konstanta
        this.R = 0.082;  // L.atm/mol.K
        this.avogadro = 6.022e23;  // jumlah partikel per mol
        this.stp_volume = 22.4;  // L/mol pada STP
        
        // Untuk menyimpan langkah perhitungan
        this.steps = [];
    }
    
    clear_steps() {
        this.steps = [];
    }
    
    add_step(step) {
        this.steps.push(step);
    }
    
    show_steps() {
        if (this.steps.length > 0) {
            return this.steps.join('\n');
        }
        return '';
    }
    
    parse_formula(formula) {
        formula = formula.trim();
        
        // Handle tanda kurung dengan rekursi sederhana
        while (formula.includes('(')) {
            const match = formula.match(/\(([^()]+)\)(\d*)/);
            if (match) {
                const inner = match[1];
                const multiplier = match[2] ? parseInt(match[2]) : 1;
                const inner_elements = this.parse_formula(inner);
                let replacement = '';
                for (const [elem, count] of Object.entries(inner_elements)) {
                    replacement += elem + (count * multiplier);
                }
                formula = formula.substring(0, match.index) + replacement + formula.substring(match.index + match[0].length);
            } else {
                break;
            }
        }
        
        const pattern = /([A-Z][a-z]?)(\d*)/g;
        const matches = [...formula.matchAll(pattern)];
        
        const elements = {};
        for (const match of matches) {
            const element = match[1];
            const count = match[2] ? parseInt(match[2]) : 1;
            if (element) {
                elements[element] = (elements[element] || 0) + count;
            }
        }
        
        return elements;
    }
    
    calculate_mr(formula, show_calculation = true) {
        this.clear_steps();
        
        const elements = this.parse_formula(formula);
        
        if (show_calculation) {
            this.add_step(`Rumus kimia: ${formula}`);
            this.add_step("Memecah rumus menjadi unsur-unsur:");
            const composition = [];
            for (const [element, count] of Object.entries(elements)) {
                if (!this.atomic_mass[element]) {
                    throw new Error(`Unsur ${element} tidak ditemukan dalam database`);
                }
                composition.push(`   ${element} = ${count} atom`);
            }
            this.add_step(composition.join('\n'));
        }
        
        let mr = 0;
        const calculation_parts = [];
        
        for (const [element, count] of Object.entries(elements)) {
            const ar = this.atomic_mass[element];
            const partial = ar * count;
            mr += partial;
            calculation_parts.push(`(${element}: ${ar} × ${count} = ${partial})`);
        }
        
        if (show_calculation) {
            this.add_step("Menghitung Mr:");
            const formula_calc = calculation_parts.join(" + ");
            this.add_step(`   Mr = ${formula_calc}`);
            this.add_step(`   Mr = ${mr} g/mol`);
        }
        
        return mr;
    }
    
    mol_from_mass(mass, mr, substance = "") {
        this.clear_steps();
        
        this.add_step("Diketahui:");
        this.add_step(`   Massa (${substance}) = ${mass} gram`);
        this.add_step(`   Mr (${substance}) = ${mr} g/mol`);
        
        this.add_step("\nDitanya: Jumlah mol (n)");
        
        this.add_step("\nRumus:");
        this.add_step("   n = massa / Mr");
        
        this.add_step("\nSubstitusi:");
        this.add_step(`   n = ${mass} / ${mr}`);
        
        const mol = mass / mr;
        this.add_step(`   n = ${mol.toFixed(4)} mol`);
        
        return mol;
    }
    
    mass_from_mol(mol, mr, substance = "") {
        this.clear_steps();
        
        this.add_step("Diketahui:");
        this.add_step(`   Jumlah mol (${substance}) = ${mol} mol`);
        this.add_step(`   Mr (${substance}) = ${mr} g/mol`);
        
        this.add_step("\nDitanya: Massa");
        
        this.add_step("\nRumus:");
        this.add_step("   massa = n × Mr");
        
        this.add_step("\nSubstitusi:");
        this.add_step(`   massa = ${mol} × ${mr}`);
        
        const mass = mol * mr;
        this.add_step(`   massa = ${mass.toFixed(4)} gram`);
        
        return mass;
    }
    
    particles_from_mol(mol) {
        this.clear_steps();
        
        this.add_step("Diketahui:");
        this.add_step(`   Jumlah mol = ${mol} mol`);
        this.add_step(`   Bilangan Avogadro (L) = ${this.avogadro.toExponential(3)} partikel/mol`);
        
        this.add_step("\nDitanya: Jumlah partikel");
        
        this.add_step("\nRumus:");
        this.add_step("   Jumlah partikel = n × L");
        
        this.add_step("\nSubstitusi:");
        this.add_step(`   Jumlah partikel = ${mol} × ${this.avogadro.toExponential(3)}`);
        
        const particles = mol * this.avogadro;
        this.add_step(`   Jumlah partikel = ${particles.toExponential(4)} partikel`);
        
        return particles;
    }
    
    mol_from_particles(particles) {
        this.clear_steps();
        
        this.add_step("Diketahui:");
        this.add_step(`   Jumlah partikel = ${particles.toExponential(4)} partikel`);
        this.add_step(`   Bilangan Avogadro (L) = ${this.avogadro.toExponential(3)} partikel/mol`);
        
        this.add_step("\nDitanya: Jumlah mol (n)");
        
        this.add_step("\nRumus:");
        this.add_step("   n = Jumlah partikel / L");
        
        this.add_step("\nSubstitusi:");
        this.add_step(`   n = ${particles.toExponential(4)} / ${this.avogadro.toExponential(3)}`);
        
        const mol = particles / this.avogadro;
        this.add_step(`   n = ${mol.toFixed(4)} mol`);
        
        return mol;
    }
    
    volume_gas_stp(mol) {
        this.clear_steps();
        
        this.add_step("Diketahui:");
        this.add_step(`   Jumlah mol gas = ${mol} mol`);
        this.add_step(`   Kondisi: STP (0°C, 1 atm)`);
        this.add_step(`   Volume molar gas pada STP = ${this.stp_volume} L/mol`);
        
        this.add_step("\nDitanya: Volume gas (V)");
        
        this.add_step("\nRumus:");
        this.add_step("   V = n × 22.4 L/mol");
        
        this.add_step("\nSubstitusi:");
        this.add_step(`   V = ${mol} × ${this.stp_volume}`);
        
        const volume = mol * this.stp_volume;
        this.add_step(`   V = ${volume.toFixed(4)} liter`);
        
        return volume;
    }
    
    mol_from_volume_stp(volume) {
        this.clear_steps();
        
        this.add_step("Diketahui:");
        this.add_step(`   Volume gas = ${volume} liter`);
        this.add_step(`   Kondisi: STP (0°C, 1 atm)`);
        this.add_step(`   Volume molar gas pada STP = ${this.stp_volume} L/mol`);
        
        this.add_step("\nDitanya: Jumlah mol (n)");
        
        this.add_step("\nRumus:");
        this.add_step("   n = V / 22.4 L/mol");
        
        this.add_step("\nSubstitusi:");
        this.add_step(`   n = ${volume} / ${this.stp_volume}`);
        
        const mol = volume / this.stp_volume;
        this.add_step(`   n = ${mol.toFixed(4)} mol`);
        
        return mol;
    }
}

// Inisialisasi calculator
const calc = new ChemistryCalculator();

// Fungsi untuk menampilkan menu
function showMenu(menuType) {
    const contentArea = document.getElementById('content-area');
    let html = '';
    
    switch(menuType) {
        case 'mr':
            html = getMrMenu();
            break;
        case 'mol-massa':
            html = getMolMassaMenu();
            break;
        case 'mol-partikel':
            html = getMolPartikelMenu();
            break;
        case 'stp':
            html = getStpMenu();
            break;
        case 'ideal-gas':
            html = getIdealGasMenu();
            break;
        case 'combined-gas':
            html = getCombinedGasMenu();
            setTimeout(() => toggleCombinedGasInputs(), 100);
            break;
        case 'molarity':
            html = getMolarityMenu();
            break;
        case 'dilution':
            html = getDilutionMenu();
            break;
        case 'mass-percent':
            html = getMassPercentMenu();
            break;
        case 'stoichiometry':
            html = getStoichiometryMenu();
            break;
        case 'limiting':
            html = getLimitingMenu();
            break;
        default:
            html = '<div class="card shadow-sm"><div class="card-body text-center py-5"><i class="bi bi-flask display-1 text-primary"></i><h3 class="mt-3">Selamat Datang!</h3><p class="text-muted">Pilih menu di sebelah kiri untuk memulai perhitungan kimia</p></div></div>';
    }
    
    contentArea.innerHTML = html;
}

// Fungsi-fungsi untuk membuat form menu
function getMrMenu() {
    return `
        <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
                <h5 class="mb-0"><i class="bi bi-calculator"></i> Menghitung Mr (Massa Molekul Relatif)</h5>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label class="form-label">Rumus Kimia</label>
                    <input type="text" class="form-control" id="mr-formula" placeholder="Contoh: H2SO4, Ca(OH)2">
                    <small class="text-muted">Masukkan rumus kimia yang ingin dihitung Mr-nya</small>
                </div>
                <button class="btn btn-primary" onclick="calculateMr()">
                    <i class="bi bi-calculate"></i> Hitung Mr
                </button>
                <div id="mr-result"></div>
            </div>
        </div>
    `;
}

function getMolMassaMenu() {
    return `
        <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
                <h5 class="mb-0"><i class="bi bi-arrow-left-right"></i> Konversi Mol ↔ Massa</h5>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label class="form-label">Pilih Konversi</label>
                    <select class="form-select" id="mol-massa-type" onchange="toggleMolMassaInputs()">
                        <option value="mol-to-mass">Mol → Massa</option>
                        <option value="mass-to-mol">Massa → Mol</option>
                    </select>
                </div>
                <div class="mb-3">
                    <label class="form-label">Rumus Kimia</label>
                    <input type="text" class="form-control" id="mol-massa-formula" placeholder="Contoh: H2O">
                </div>
                <div class="mb-3" id="mol-input-group">
                    <label class="form-label">Jumlah Mol</label>
                    <input type="number" class="form-control" id="mol-value" placeholder="Masukkan jumlah mol" step="0.0001">
                </div>
                <div class="mb-3" id="mass-input-group" style="display:none;">
                    <label class="form-label">Massa (gram)</label>
                    <input type="number" class="form-control" id="mass-value" placeholder="Masukkan massa dalam gram" step="0.0001">
                </div>
                <button class="btn btn-primary" onclick="calculateMolMassa()">
                    <i class="bi bi-calculate"></i> Hitung
                </button>
                <div id="mol-massa-result"></div>
            </div>
        </div>
    `;
}

function getMolPartikelMenu() {
    return `
        <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
                <h5 class="mb-0"><i class="bi bi-arrow-left-right"></i> Konversi Mol ↔ Jumlah Partikel</h5>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label class="form-label">Pilih Konversi</label>
                    <select class="form-select" id="mol-partikel-type" onchange="toggleMolPartikelInputs()">
                        <option value="mol-to-particles">Mol → Partikel</option>
                        <option value="particles-to-mol">Partikel → Mol</option>
                    </select>
                </div>
                <div class="mb-3" id="mol-partikel-input-group">
                    <label class="form-label">Jumlah Mol</label>
                    <input type="number" class="form-control" id="mol-partikel-value" placeholder="Masukkan jumlah mol" step="0.0001">
                </div>
                <div class="mb-3" id="particles-input-group" style="display:none;">
                    <label class="form-label">Jumlah Partikel</label>
                    <input type="number" class="form-control" id="particles-value" placeholder="Masukkan jumlah partikel" step="1e10">
                </div>
                <button class="btn btn-primary" onclick="calculateMolPartikel()">
                    <i class="bi bi-calculate"></i> Hitung
                </button>
                <div id="mol-partikel-result"></div>
            </div>
        </div>
    `;
}

function getStpMenu() {
    return `
        <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
                <h5 class="mb-0"><i class="bi bi-arrow-left-right"></i> Volume Gas pada STP</h5>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label class="form-label">Pilih Konversi</label>
                    <select class="form-select" id="stp-type" onchange="toggleStpInputs()">
                        <option value="mol-to-volume">Mol → Volume</option>
                        <option value="volume-to-mol">Volume → Mol</option>
                    </select>
                </div>
                <div class="mb-3" id="stp-mol-input-group">
                    <label class="form-label">Jumlah Mol Gas</label>
                    <input type="number" class="form-control" id="stp-mol-value" placeholder="Masukkan jumlah mol" step="0.0001">
                </div>
                <div class="mb-3" id="stp-volume-input-group" style="display:none;">
                    <label class="form-label">Volume Gas (liter)</label>
                    <input type="number" class="form-control" id="stp-volume-value" placeholder="Masukkan volume dalam liter" step="0.0001">
                </div>
                <button class="btn btn-primary" onclick="calculateStp()">
                    <i class="bi bi-calculate"></i> Hitung
                </button>
                <div id="stp-result"></div>
            </div>
        </div>
    `;
}

// Fungsi toggle untuk input
function toggleMolMassaInputs() {
    const type = document.getElementById('mol-massa-type').value;
    const molGroup = document.getElementById('mol-input-group');
    const massGroup = document.getElementById('mass-input-group');
    
    if (type === 'mol-to-mass') {
        molGroup.style.display = 'block';
        massGroup.style.display = 'none';
    } else {
        molGroup.style.display = 'none';
        massGroup.style.display = 'block';
    }
}

function toggleMolPartikelInputs() {
    const type = document.getElementById('mol-partikel-type').value;
    const molGroup = document.getElementById('mol-partikel-input-group');
    const particlesGroup = document.getElementById('particles-input-group');
    
    if (type === 'mol-to-particles') {
        molGroup.style.display = 'block';
        particlesGroup.style.display = 'none';
    } else {
        molGroup.style.display = 'none';
        particlesGroup.style.display = 'block';
    }
}

function toggleStpInputs() {
    const type = document.getElementById('stp-type').value;
    const molGroup = document.getElementById('stp-mol-input-group');
    const volumeGroup = document.getElementById('stp-volume-input-group');
    
    if (type === 'mol-to-volume') {
        molGroup.style.display = 'block';
        volumeGroup.style.display = 'none';
    } else {
        molGroup.style.display = 'none';
        volumeGroup.style.display = 'block';
    }
}

// Fungsi-fungsi perhitungan
function calculateMr() {
    try {
        const formula = document.getElementById('mr-formula').value.trim();
        if (!formula) {
            showCustomAlert('Masukkan rumus kimia!');
            return;
        }
        
        const mr = calc.calculate_mr(formula, true);
        const steps = calc.show_steps();
        
        const resultHtml = `
            <div class="result-box mt-4">
                <h5><i class="bi bi-check-circle"></i> Hasil Akhir</h5>
                <p class="h4 mb-0">Mr ${formula} = ${mr} g/mol</p>
            </div>
            <div class="steps-box mt-3">
                <h6><i class="bi bi-list-ol"></i> Langkah-langkah Perhitungan:</h6>
                <pre>${steps}</pre>
            </div>
        `;
        
        document.getElementById('mr-result').innerHTML = resultHtml;
    } catch (error) {
        document.getElementById('mr-result').innerHTML = `
            <div class="alert alert-danger mt-3">
                <i class="bi bi-exclamation-triangle"></i> ${error.message}
            </div>
        `;
    }
}

function calculateMolMassa() {
    try {
        const type = document.getElementById('mol-massa-type').value;
        const formula = document.getElementById('mol-massa-formula').value.trim();
        if (!formula) {
            showCustomAlert('Masukkan rumus kimia!');
            return;
        }
        
        const mr = calc.calculate_mr(formula, false);
        let result, steps;
        
        if (type === 'mol-to-mass') {
            const mol = parseFloat(document.getElementById('mol-value').value);
            if (isNaN(mol)) {
                showCustomAlert('Masukkan jumlah mol yang valid!');
                return;
            }
            result = calc.mass_from_mol(mol, mr, formula);
            steps = calc.show_steps();
            
            document.getElementById('mol-massa-result').innerHTML = `
                <div class="result-box mt-4">
                    <h5><i class="bi bi-check-circle"></i> Hasil Akhir</h5>
                    <p class="h4 mb-0">Massa ${formula} = ${result.toFixed(4)} gram</p>
                </div>
                <div class="steps-box mt-3">
                    <h6><i class="bi bi-list-ol"></i> Langkah-langkah Perhitungan:</h6>
                    <pre>${steps}</pre>
                </div>
            `;
        } else {
            const mass = parseFloat(document.getElementById('mass-value').value);
            if (isNaN(mass)) {
                showCustomAlert('Masukkan massa yang valid!');
                return;
            }
            result = calc.mol_from_mass(mass, mr, formula);
            steps = calc.show_steps();
            
            document.getElementById('mol-massa-result').innerHTML = `
                <div class="result-box mt-4">
                    <h5><i class="bi bi-check-circle"></i> Hasil Akhir</h5>
                    <p class="h4 mb-0">Mol ${formula} = ${result.toFixed(4)} mol</p>
                </div>
                <div class="steps-box mt-3">
                    <h6><i class="bi bi-list-ol"></i> Langkah-langkah Perhitungan:</h6>
                    <pre>${steps}</pre>
                </div>
            `;
        }
    } catch (error) {
        document.getElementById('mol-massa-result').innerHTML = `
            <div class="alert alert-danger mt-3">
                <i class="bi bi-exclamation-triangle"></i> ${error.message}
            </div>
        `;
    }
}

function calculateMolPartikel() {
    try {
        const type = document.getElementById('mol-partikel-type').value;
        let result, steps;
        
        if (type === 'mol-to-particles') {
            const mol = parseFloat(document.getElementById('mol-partikel-value').value);
            if (isNaN(mol)) {
                showCustomAlert('Masukkan jumlah mol yang valid!');
                return;
            }
            result = calc.particles_from_mol(mol);
            steps = calc.show_steps();
            
            document.getElementById('mol-partikel-result').innerHTML = `
                <div class="result-box mt-4">
                    <h5><i class="bi bi-check-circle"></i> Hasil Akhir</h5>
                    <p class="h4 mb-0">${result.toExponential(4)} partikel</p>
                </div>
                <div class="steps-box mt-3">
                    <h6><i class="bi bi-list-ol"></i> Langkah-langkah Perhitungan:</h6>
                    <pre>${steps}</pre>
                </div>
            `;
        } else {
            const particles = parseFloat(document.getElementById('particles-value').value);
            if (isNaN(particles)) {
                showCustomAlert('Masukkan jumlah partikel yang valid!');
                return;
            }
            result = calc.mol_from_particles(particles);
            steps = calc.show_steps();
            
            document.getElementById('mol-partikel-result').innerHTML = `
                <div class="result-box mt-4">
                    <h5><i class="bi bi-check-circle"></i> Hasil Akhir</h5>
                    <p class="h4 mb-0">${result.toFixed(4)} mol</p>
                </div>
                <div class="steps-box mt-3">
                    <h6><i class="bi bi-list-ol"></i> Langkah-langkah Perhitungan:</h6>
                    <pre>${steps}</pre>
                </div>
            `;
        }
    } catch (error) {
        document.getElementById('mol-partikel-result').innerHTML = `
            <div class="alert alert-danger mt-3">
                <i class="bi bi-exclamation-triangle"></i> ${error.message}
            </div>
        `;
    }
}

function calculateStp() {
    try {
        const type = document.getElementById('stp-type').value;
        let result, steps;
        
        if (type === 'mol-to-volume') {
            const mol = parseFloat(document.getElementById('stp-mol-value').value);
            if (isNaN(mol)) {
                showCustomAlert('Masukkan jumlah mol yang valid!');
                return;
            }
            result = calc.volume_gas_stp(mol);
            steps = calc.show_steps();
            
            document.getElementById('stp-result').innerHTML = `
                <div class="result-box mt-4">
                    <h5><i class="bi bi-check-circle"></i> Hasil Akhir</h5>
                    <p class="h4 mb-0">Volume = ${result.toFixed(4)} liter</p>
                </div>
                <div class="steps-box mt-3">
                    <h6><i class="bi bi-list-ol"></i> Langkah-langkah Perhitungan:</h6>
                    <pre>${steps}</pre>
                </div>
            `;
        } else {
            const volume = parseFloat(document.getElementById('stp-volume-value').value);
            if (isNaN(volume)) {
                showCustomAlert('Masukkan volume yang valid!');
                return;
            }
            result = calc.mol_from_volume_stp(volume);
            steps = calc.show_steps();
            
            document.getElementById('stp-result').innerHTML = `
                <div class="result-box mt-4">
                    <h5><i class="bi bi-check-circle"></i> Hasil Akhir</h5>
                    <p class="h4 mb-0">Mol = ${result.toFixed(4)} mol</p>
                </div>
                <div class="steps-box mt-3">
                    <h6><i class="bi bi-list-ol"></i> Langkah-langkah Perhitungan:</h6>
                    <pre>${steps}</pre>
                </div>
            `;
        }
    } catch (error) {
        document.getElementById('stp-result').innerHTML = `
            <div class="alert alert-danger mt-3">
                <i class="bi bi-exclamation-triangle"></i> ${error.message}
            </div>
        `;
    }
}

// Menambahkan method-method yang masih kurang ke class ChemistryCalculator
ChemistryCalculator.prototype.ideal_gas_law = function(P, V, n, T) {
    this.clear_steps();
    
    this.add_step("Diketahui:");
    if (P !== null && P !== undefined) this.add_step(`   Tekanan (P) = ${P} atm`);
    if (V !== null && V !== undefined) this.add_step(`   Volume (V) = ${V} liter`);
    if (n !== null && n !== undefined) this.add_step(`   Mol (n) = ${n} mol`);
    if (T !== null && T !== undefined) this.add_step(`   Suhu (T) = ${T} K`);
    this.add_step(`   Konstanta gas (R) = ${this.R} L.atm/mol.K`);
    
    this.add_step("\nRumus Hukum Gas Ideal:");
    this.add_step("   PV = nRT");
    
    let result;
    if (P === null || P === undefined) {
        this.add_step("\nDitanya: Tekanan (P)");
        this.add_step("\nMengubah rumus:");
        this.add_step("   P = nRT / V");
        this.add_step("\nSubstitusi:");
        this.add_step(`   P = (${n} × ${this.R} × ${T}) / ${V}`);
        this.add_step(`   P = ${n * this.R * T} / ${V}`);
        result = (n * this.R * T) / V;
        this.add_step(`   P = ${result.toFixed(4)} atm`);
    } else if (V === null || V === undefined) {
        this.add_step("\nDitanya: Volume (V)");
        this.add_step("\nMengubah rumus:");
        this.add_step("   V = nRT / P");
        this.add_step("\nSubstitusi:");
        this.add_step(`   V = (${n} × ${this.R} × ${T}) / ${P}`);
        this.add_step(`   V = ${n * this.R * T} / ${P}`);
        result = (n * this.R * T) / P;
        this.add_step(`   V = ${result.toFixed(4)} liter`);
    } else if (n === null || n === undefined) {
        this.add_step("\nDitanya: Mol (n)");
        this.add_step("\nMengubah rumus:");
        this.add_step("   n = PV / RT");
        this.add_step("\nSubstitusi:");
        this.add_step(`   n = (${P} × ${V}) / (${this.R} × ${T})`);
        this.add_step(`   n = ${P * V} / ${this.R * T}`);
        result = (P * V) / (this.R * T);
        this.add_step(`   n = ${result.toFixed(4)} mol`);
    } else if (T === null || T === undefined) {
        this.add_step("\nDitanya: Suhu (T)");
        this.add_step("\nMengubah rumus:");
        this.add_step("   T = PV / nR");
        this.add_step("\nSubstitusi:");
        this.add_step(`   T = (${P} × ${V}) / (${n} × ${this.R})`);
        this.add_step(`   T = ${P * V} / ${n * this.R}`);
        result = (P * V) / (n * this.R);
        this.add_step(`   T = ${result.toFixed(4)} K`);
    }
    
    return result;
};

ChemistryCalculator.prototype.combined_gas_law = function(P1, V1, T1, P2, V2, T2) {
    this.clear_steps();
    
    this.add_step("Diketahui:");
    this.add_step("Kondisi Awal:");
    if (P1 !== null && P1 !== undefined) this.add_step(`   P1 = ${P1} atm`);
    if (V1 !== null && V1 !== undefined) this.add_step(`   V1 = ${V1} liter`);
    if (T1 !== null && T1 !== undefined) this.add_step(`   T1 = ${T1} K`);
    
    this.add_step("\nKondisi Akhir:");
    if (P2 !== null && P2 !== undefined) this.add_step(`   P2 = ${P2} atm`);
    if (V2 !== null && V2 !== undefined) this.add_step(`   V2 = ${V2} liter`);
    if (T2 !== null && T2 !== undefined) this.add_step(`   T2 = ${T2} K`);
    
    this.add_step("\nRumus Hukum Gas Gabungan:");
    this.add_step("   (P1 × V1) / T1 = (P2 × V2) / T2");
    
    let result;
    if (P1 === null || P1 === undefined) {
        this.add_step("\nDitanya: P1");
        this.add_step("\nMengubah rumus:");
        this.add_step("   P1 = (P2 × V2 × T1) / (V1 × T2)");
        this.add_step("\nSubstitusi:");
        this.add_step(`   P1 = (${P2} × ${V2} × ${T1}) / (${V1} × ${T2})`);
        this.add_step(`   P1 = ${P2 * V2 * T1} / ${V1 * T2}`);
        result = (P2 * V2 * T1) / (V1 * T2);
        this.add_step(`   P1 = ${result.toFixed(4)} atm`);
    } else if (V1 === null || V1 === undefined) {
        this.add_step("\nDitanya: V1");
        this.add_step("\nMengubah rumus:");
        this.add_step("   V1 = (P2 × V2 × T1) / (P1 × T2)");
        this.add_step("\nSubstitusi:");
        this.add_step(`   V1 = (${P2} × ${V2} × ${T1}) / (${P1} × ${T2})`);
        this.add_step(`   V1 = ${P2 * V2 * T1} / ${P1 * T2}`);
        result = (P2 * V2 * T1) / (P1 * T2);
        this.add_step(`   V1 = ${result.toFixed(4)} liter`);
    } else if (T1 === null || T1 === undefined) {
        this.add_step("\nDitanya: T1");
        this.add_step("\nMengubah rumus:");
        this.add_step("   T1 = (P1 × V1 × T2) / (P2 × V2)");
        this.add_step("\nSubstitusi:");
        this.add_step(`   T1 = (${P1} × ${V1} × ${T2}) / (${P2} × ${V2})`);
        this.add_step(`   T1 = ${P1 * V1 * T2} / ${P2 * V2}`);
        result = (P1 * V1 * T2) / (P2 * V2);
        this.add_step(`   T1 = ${result.toFixed(4)} K`);
    } else if (P2 === null || P2 === undefined) {
        this.add_step("\nDitanya: P2");
        this.add_step("\nMengubah rumus:");
        this.add_step("   P2 = (P1 × V1 × T2) / (V2 × T1)");
        this.add_step("\nSubstitusi:");
        this.add_step(`   P2 = (${P1} × ${V1} × ${T2}) / (${V2} × ${T1})`);
        this.add_step(`   P2 = ${P1 * V1 * T2} / ${V2 * T1}`);
        result = (P1 * V1 * T2) / (V2 * T1);
        this.add_step(`   P2 = ${result.toFixed(4)} atm`);
    } else if (V2 === null || V2 === undefined) {
        this.add_step("\nDitanya: V2");
        this.add_step("\nMengubah rumus:");
        this.add_step("   V2 = (P1 × V1 × T2) / (P2 × T1)");
        this.add_step("\nSubstitusi:");
        this.add_step(`   V2 = (${P1} × ${V1} × ${T2}) / (${P2} × ${T1})`);
        this.add_step(`   V2 = ${P1 * V1 * T2} / ${P2 * T1}`);
        result = (P1 * V1 * T2) / (P2 * T1);
        this.add_step(`   V2 = ${result.toFixed(4)} liter`);
    } else if (T2 === null || T2 === undefined) {
        this.add_step("\nDitanya: T2");
        this.add_step("\nMengubah rumus:");
        this.add_step("   T2 = (P2 × V2 × T1) / (P1 × V1)");
        this.add_step("\nSubstitusi:");
        this.add_step(`   T2 = (${P2} × ${V2} × ${T1}) / (${P1} × ${V1})`);
        this.add_step(`   T2 = ${P2 * V2 * T1} / ${P1 * V1}`);
        result = (P2 * V2 * T1) / (P1 * V1);
        this.add_step(`   T2 = ${result.toFixed(4)} K`);
    }
    
    return result;
};

ChemistryCalculator.prototype.isothermal_process = function(P1, V1, P2, V2) {
    this.clear_steps();
    
    this.add_step("Diketahui:");
    this.add_step("   Proses: Isotermal (suhu tetap, T1 = T2)");
    if (P1 !== null && P1 !== undefined) this.add_step(`   P1 = ${P1} atm`);
    if (V1 !== null && V1 !== undefined) this.add_step(`   V1 = ${V1} liter`);
    if (P2 !== null && P2 !== undefined) this.add_step(`   P2 = ${P2} atm`);
    if (V2 !== null && V2 !== undefined) this.add_step(`   V2 = ${V2} liter`);
    
    this.add_step("\nRumus Hukum Boyle (Proses Isotermal):");
    this.add_step("   P1 × V1 = P2 × V2");
    
    let result;
    if (P1 === null || P1 === undefined) {
        this.add_step("\nDitanya: P1");
        this.add_step("\nMengubah rumus:");
        this.add_step("   P1 = (P2 × V2) / V1");
        this.add_step("\nSubstitusi:");
        this.add_step(`   P1 = (${P2} × ${V2}) / ${V1}`);
        this.add_step(`   P1 = ${P2 * V2} / ${V1}`);
        result = (P2 * V2) / V1;
        this.add_step(`   P1 = ${result.toFixed(4)} atm`);
    } else if (V1 === null || V1 === undefined) {
        this.add_step("\nDitanya: V1");
        this.add_step("\nMengubah rumus:");
        this.add_step("   V1 = (P2 × V2) / P1");
        this.add_step("\nSubstitusi:");
        this.add_step(`   V1 = (${P2} × ${V2}) / ${P1}`);
        this.add_step(`   V1 = ${P2 * V2} / ${P1}`);
        result = (P2 * V2) / P1;
        this.add_step(`   V1 = ${result.toFixed(4)} liter`);
    } else if (P2 === null || P2 === undefined) {
        this.add_step("\nDitanya: P2");
        this.add_step("\nMengubah rumus:");
        this.add_step("   P2 = (P1 × V1) / V2");
        this.add_step("\nSubstitusi:");
        this.add_step(`   P2 = (${P1} × ${V1}) / ${V2}`);
        this.add_step(`   P2 = ${P1 * V1} / ${V2}`);
        result = (P1 * V1) / V2;
        this.add_step(`   P2 = ${result.toFixed(4)} atm`);
    } else if (V2 === null || V2 === undefined) {
        this.add_step("\nDitanya: V2");
        this.add_step("\nMengubah rumus:");
        this.add_step("   V2 = (P1 × V1) / P2");
        this.add_step("\nSubstitusi:");
        this.add_step(`   V2 = (${P1} × ${V1}) / ${P2}`);
        this.add_step(`   V2 = ${P1 * V1} / ${P2}`);
        result = (P1 * V1) / P2;
        this.add_step(`   V2 = ${result.toFixed(4)} liter`);
    }
    
    return result;
};

ChemistryCalculator.prototype.isobaric_process = function(V1, T1, V2, T2) {
    this.clear_steps();
    
    this.add_step("Diketahui:");
    this.add_step("   Proses: Isobarik (tekanan tetap, P1 = P2)");
    if (V1 !== null && V1 !== undefined) this.add_step(`   V1 = ${V1} liter`);
    if (T1 !== null && T1 !== undefined) this.add_step(`   T1 = ${T1} K`);
    if (V2 !== null && V2 !== undefined) this.add_step(`   V2 = ${V2} liter`);
    if (T2 !== null && T2 !== undefined) this.add_step(`   T2 = ${T2} K`);
    
    this.add_step("\nRumus Hukum Charles (Proses Isobarik):");
    this.add_step("   V1 / T1 = V2 / T2");
    
    let result;
    if (V1 === null || V1 === undefined) {
        this.add_step("\nDitanya: V1");
        this.add_step("\nMengubah rumus:");
        this.add_step("   V1 = (V2 × T1) / T2");
        this.add_step("\nSubstitusi:");
        this.add_step(`   V1 = (${V2} × ${T1}) / ${T2}`);
        this.add_step(`   V1 = ${V2 * T1} / ${T2}`);
        result = (V2 * T1) / T2;
        this.add_step(`   V1 = ${result.toFixed(4)} liter`);
    } else if (T1 === null || T1 === undefined) {
        this.add_step("\nDitanya: T1");
        this.add_step("\nMengubah rumus:");
        this.add_step("   T1 = (V1 × T2) / V2");
        this.add_step("\nSubstitusi:");
        this.add_step(`   T1 = (${V1} × ${T2}) / ${V2}`);
        this.add_step(`   T1 = ${V1 * T2} / ${V2}`);
        result = (V1 * T2) / V2;
        this.add_step(`   T1 = ${result.toFixed(4)} K`);
    } else if (V2 === null || V2 === undefined) {
        this.add_step("\nDitanya: V2");
        this.add_step("\nMengubah rumus:");
        this.add_step("   V2 = (V1 × T2) / T1");
        this.add_step("\nSubstitusi:");
        this.add_step(`   V2 = (${V1} × ${T2}) / ${T1}`);
        this.add_step(`   V2 = ${V1 * T2} / ${T1}`);
        result = (V1 * T2) / T1;
        this.add_step(`   V2 = ${result.toFixed(4)} liter`);
    } else if (T2 === null || T2 === undefined) {
        this.add_step("\nDitanya: T2");
        this.add_step("\nMengubah rumus:");
        this.add_step("   T2 = (V2 × T1) / V1");
        this.add_step("\nSubstitusi:");
        this.add_step(`   T2 = (${V2} × ${T1}) / ${V1}`);
        this.add_step(`   T2 = ${V2 * T1} / ${V1}`);
        result = (V2 * T1) / V1;
        this.add_step(`   T2 = ${result.toFixed(4)} K`);
    }
    
    return result;
};

ChemistryCalculator.prototype.isochoric_process = function(P1, T1, P2, T2) {
    this.clear_steps();
    
    this.add_step("Diketahui:");
    this.add_step("   Proses: Isokorik (volume tetap, V1 = V2)");
    if (P1 !== null && P1 !== undefined) this.add_step(`   P1 = ${P1} atm`);
    if (T1 !== null && T1 !== undefined) this.add_step(`   T1 = ${T1} K`);
    if (P2 !== null && P2 !== undefined) this.add_step(`   P2 = ${P2} atm`);
    if (T2 !== null && T2 !== undefined) this.add_step(`   T2 = ${T2} K`);
    
    this.add_step("\nRumus Hukum Gay-Lussac (Proses Isokorik):");
    this.add_step("   P1 / T1 = P2 / T2");
    
    let result;
    if (P1 === null || P1 === undefined) {
        this.add_step("\nDitanya: P1");
        this.add_step("\nMengubah rumus:");
        this.add_step("   P1 = (P2 × T1) / T2");
        this.add_step("\nSubstitusi:");
        this.add_step(`   P1 = (${P2} × ${T1}) / ${T2}`);
        this.add_step(`   P1 = ${P2 * T1} / ${T2}`);
        result = (P2 * T1) / T2;
        this.add_step(`   P1 = ${result.toFixed(4)} atm`);
    } else if (T1 === null || T1 === undefined) {
        this.add_step("\nDitanya: T1");
        this.add_step("\nMengubah rumus:");
        this.add_step("   T1 = (P1 × T2) / P2");
        this.add_step("\nSubstitusi:");
        this.add_step(`   T1 = (${P1} × ${T2}) / ${P2}`);
        this.add_step(`   T1 = ${P1 * T2} / ${P2}`);
        result = (P1 * T2) / P2;
        this.add_step(`   T1 = ${result.toFixed(4)} K`);
    } else if (P2 === null || P2 === undefined) {
        this.add_step("\nDitanya: P2");
        this.add_step("\nMengubah rumus:");
        this.add_step("   P2 = (P1 × T2) / T1");
        this.add_step("\nSubstitusi:");
        this.add_step(`   P2 = (${P1} × ${T2}) / ${T1}`);
        this.add_step(`   P2 = ${P1 * T2} / ${T1}`);
        result = (P1 * T2) / T1;
        this.add_step(`   P2 = ${result.toFixed(4)} atm`);
    } else if (T2 === null || T2 === undefined) {
        this.add_step("\nDitanya: T2");
        this.add_step("\nMengubah rumus:");
        this.add_step("   T2 = (P2 × T1) / P1");
        this.add_step("\nSubstitusi:");
        this.add_step(`   T2 = (${P2} × ${T1}) / ${P1}`);
        this.add_step(`   T2 = ${P2 * T1} / ${P1}`);
        result = (P2 * T1) / P1;
        this.add_step(`   T2 = ${result.toFixed(4)} K`);
    }
    
    return result;
};

ChemistryCalculator.prototype.molarity = function(mol, volume_L, molarity) {
    this.clear_steps();
    
    this.add_step("Diketahui:");
    if (mol !== null && mol !== undefined) this.add_step(`   Mol zat terlarut (n) = ${mol} mol`);
    if (volume_L !== null && volume_L !== undefined) this.add_step(`   Volume larutan (V) = ${volume_L} liter`);
    if (molarity !== null && molarity !== undefined) this.add_step(`   Molaritas (M) = ${molarity} M`);
    
    this.add_step("\nRumus Molaritas:");
    this.add_step("   M = n / V");
    
    let result;
    if (molarity === null || molarity === undefined) {
        this.add_step("\nDitanya: Molaritas (M)");
        this.add_step("\nSubstitusi:");
        this.add_step(`   M = ${mol} / ${volume_L}`);
        result = mol / volume_L;
        this.add_step(`   M = ${result.toFixed(4)} M`);
    } else if (mol === null || mol === undefined) {
        this.add_step("\nDitanya: Mol (n)");
        this.add_step("\nMengubah rumus:");
        this.add_step("   n = M × V");
        this.add_step("\nSubstitusi:");
        this.add_step(`   n = ${molarity} × ${volume_L}`);
        result = molarity * volume_L;
        this.add_step(`   n = ${result.toFixed(4)} mol`);
    } else if (volume_L === null || volume_L === undefined) {
        this.add_step("\nDitanya: Volume (V)");
        this.add_step("\nMengubah rumus:");
        this.add_step("   V = n / M");
        this.add_step("\nSubstitusi:");
        this.add_step(`   V = ${mol} / ${molarity}`);
        result = mol / molarity;
        this.add_step(`   V = ${result.toFixed(4)} liter`);
    }
    
    return result;
};

ChemistryCalculator.prototype.mass_percent = function(mass_zat, mass_larutan) {
    this.clear_steps();
    
    this.add_step("Diketahui:");
    this.add_step(`   Massa zat terlarut = ${mass_zat} gram`);
    this.add_step(`   Massa larutan = ${mass_larutan} gram`);
    
    this.add_step("\nDitanya: Persen massa (%)");
    
    this.add_step("\nRumus:");
    this.add_step("   % massa = (massa zat / massa larutan) × 100%");
    
    this.add_step("\nSubstitusi:");
    this.add_step(`   % massa = (${mass_zat} / ${mass_larutan}) × 100%`);
    this.add_step(`   % massa = ${mass_zat / mass_larutan} × 100%`);
    
    const percent = (mass_zat / mass_larutan) * 100;
    this.add_step(`   % massa = ${percent.toFixed(2)}%`);
    
    return percent;
};

ChemistryCalculator.prototype.stoichiometry = function(mol_reactant, coef_reactant, coef_product, reactant_name = "", product_name = "") {
    this.clear_steps();
    
    this.add_step("Diketahui:");
    this.add_step(`   Mol ${reactant_name} = ${mol_reactant} mol`);
    this.add_step(`   Koefisien ${reactant_name} = ${coef_reactant}`);
    this.add_step(`   Koefisien ${product_name} = ${coef_product}`);
    
    this.add_step(`\nDitanya: Mol ${product_name}`);
    
    this.add_step("\nPerbandingan Stoikiometri:");
    this.add_step(`   ${reactant_name} : ${product_name} = ${coef_reactant} : ${coef_product}`);
    
    this.add_step("\nRumus:");
    this.add_step(`   mol ${product_name} = (mol ${reactant_name} × koef ${product_name}) / koef ${reactant_name}`);
    
    this.add_step("\nSubstitusi:");
    this.add_step(`   mol ${product_name} = (${mol_reactant} × ${coef_product}) / ${coef_reactant}`);
    this.add_step(`   mol ${product_name} = ${mol_reactant * coef_product} / ${coef_reactant}`);
    
    const mol_product = (mol_reactant * coef_product) / coef_reactant;
    this.add_step(`   mol ${product_name} = ${mol_product.toFixed(4)} mol`);
    
    return mol_product;
};

ChemistryCalculator.prototype.dilution = function(M1, V1, M2, V2) {
    this.clear_steps();
    
    this.add_step("Diketahui:");
    if (M1 !== null && M1 !== undefined) this.add_step(`   Molaritas awal (M1) = ${M1} M`);
    if (V1 !== null && V1 !== undefined) this.add_step(`   Volume awal (V1) = ${V1} mL`);
    if (M2 !== null && M2 !== undefined) this.add_step(`   Molaritas akhir (M2) = ${M2} M`);
    if (V2 !== null && V2 !== undefined) this.add_step(`   Volume akhir (V2) = ${V2} mL`);
    
    this.add_step("\nRumus Pengenceran:");
    this.add_step("   M1 × V1 = M2 × V2");
    
    let result;
    if (M1 === null || M1 === undefined) {
        this.add_step("\nDitanya: M1");
        this.add_step("\nMengubah rumus:");
        this.add_step("   M1 = (M2 × V2) / V1");
        this.add_step("\nSubstitusi:");
        this.add_step(`   M1 = (${M2} × ${V2}) / ${V1}`);
        this.add_step(`   M1 = ${M2 * V2} / ${V1}`);
        result = (M2 * V2) / V1;
        this.add_step(`   M1 = ${result.toFixed(4)} M`);
    } else if (V1 === null || V1 === undefined) {
        this.add_step("\nDitanya: V1");
        this.add_step("\nMengubah rumus:");
        this.add_step("   V1 = (M2 × V2) / M1");
        this.add_step("\nSubstitusi:");
        this.add_step(`   V1 = (${M2} × ${V2}) / ${M1}`);
        this.add_step(`   V1 = ${M2 * V2} / ${M1}`);
        result = (M2 * V2) / M1;
        this.add_step(`   V1 = ${result.toFixed(4)} mL`);
    } else if (M2 === null || M2 === undefined) {
        this.add_step("\nDitanya: M2");
        this.add_step("\nMengubah rumus:");
        this.add_step("   M2 = (M1 × V1) / V2");
        this.add_step("\nSubstitusi:");
        this.add_step(`   M2 = (${M1} × ${V1}) / ${V2}`);
        this.add_step(`   M2 = ${M1 * V1} / ${V2}`);
        result = (M1 * V1) / V2;
        this.add_step(`   M2 = ${result.toFixed(4)} M`);
    } else if (V2 === null || V2 === undefined) {
        this.add_step("\nDitanya: V2");
        this.add_step("\nMengubah rumus:");
        this.add_step("   V2 = (M1 × V1) / M2");
        this.add_step("\nSubstitusi:");
        this.add_step(`   V2 = (${M1} × ${V1}) / ${M2}`);
        this.add_step(`   V2 = ${M1 * V1} / ${M2}`);
        result = (M1 * V1) / M2;
        this.add_step(`   V2 = ${result.toFixed(4)} mL`);
    }
    
    return result;
};

ChemistryCalculator.prototype.limiting_reactant = function(mol_A, coef_A, mol_B, coef_B, name_A = "A", name_B = "B") {
    this.clear_steps();
    
    this.add_step("Diketahui:");
    this.add_step(`   Mol ${name_A} = ${mol_A} mol`);
    this.add_step(`   Koefisien ${name_A} = ${coef_A}`);
    this.add_step(`   Mol ${name_B} = ${mol_B} mol`);
    this.add_step(`   Koefisien ${name_B} = ${coef_B}`);
    
    this.add_step("\nDitanya: Pereaksi pembatas");
    
    this.add_step("\nMenghitung perbandingan mol/koefisien:");
    const ratio_A = mol_A / coef_A;
    const ratio_B = mol_B / coef_B;
    
    this.add_step(`   ${name_A}: ${mol_A} / ${coef_A} = ${ratio_A.toFixed(4)}`);
    this.add_step(`   ${name_B}: ${mol_B} / ${coef_B} = ${ratio_B.toFixed(4)}`);
    
    let limiting;
    if (ratio_A < ratio_B) {
        this.add_step(`\nKarena ${ratio_A.toFixed(4)} < ${ratio_B.toFixed(4)}`);
        this.add_step(`Maka ${name_A} adalah pereaksi pembatas`);
        limiting = name_A;
    } else {
        this.add_step(`\nKarena ${ratio_B.toFixed(4)} < ${ratio_A.toFixed(4)}`);
        this.add_step(`Maka ${name_B} adalah pereaksi pembatas`);
        limiting = name_B;
    }
    
    return { limiting, ratio_A, ratio_B };
};

// Fungsi-fungsi menu yang masih kurang
function getIdealGasMenu() {
    return `
        <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
                <h5 class="mb-0"><i class="bi bi-thermometer"></i> Hukum Gas Ideal (PV = nRT)</h5>
            </div>
            <div class="card-body">
                <p class="text-muted">Masukkan 3 dari 4 variabel (kosongkan yang dicari)</p>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Tekanan P (atm)</label>
                        <input type="number" class="form-control" id="ideal-P" placeholder="Kosongkan jika dicari" step="0.0001">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Volume V (liter)</label>
                        <input type="number" class="form-control" id="ideal-V" placeholder="Kosongkan jika dicari" step="0.0001">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Mol n</label>
                        <input type="number" class="form-control" id="ideal-n" placeholder="Kosongkan jika dicari" step="0.0001">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Suhu T (Kelvin)</label>
                        <input type="number" class="form-control" id="ideal-T" placeholder="Kosongkan jika dicari" step="0.0001">
                    </div>
                </div>
                <button class="btn btn-primary" onclick="calculateIdealGas()">
                    <i class="bi bi-calculate"></i> Hitung
                </button>
                <div id="ideal-gas-result"></div>
            </div>
        </div>
    `;
}

function getCombinedGasMenu() {
    return `
        <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
                <h5 class="mb-0"><i class="bi bi-arrow-left-right"></i> Hukum Gas Gabungan</h5>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label class="form-label">Pilih Proses</label>
                    <select class="form-select" id="combined-gas-type" onchange="toggleCombinedGasInputs()">
                        <option value="general">Hukum Gas Gabungan Umum (P1V1/T1 = P2V2/T2)</option>
                        <option value="isothermal">Proses Isotermal - Suhu Tetap (P1V1 = P2V2)</option>
                        <option value="isobaric">Proses Isobarik - Tekanan Tetap (V1/T1 = V2/T2)</option>
                        <option value="isochoric">Proses Isokorik - Volume Tetap (P1/T1 = P2/T2)</option>
                    </select>
                </div>
                <div id="combined-gas-inputs"></div>
                <button class="btn btn-primary" onclick="calculateCombinedGas()">
                    <i class="bi bi-calculate"></i> Hitung
                </button>
                <div id="combined-gas-result"></div>
            </div>
        </div>
    `;
}

function getMolarityMenu() {
    return `
        <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
                <h5 class="mb-0"><i class="bi bi-droplet"></i> Molaritas Larutan (M = n/V)</h5>
            </div>
            <div class="card-body">
                <p class="text-muted">Masukkan 2 dari 3 variabel (kosongkan yang dicari)</p>
                <div class="row">
                    <div class="col-md-4 mb-3">
                        <label class="form-label">Mol (n)</label>
                        <input type="number" class="form-control" id="molarity-mol" placeholder="Kosongkan jika dicari" step="0.0001">
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label">Volume larutan (liter)</label>
                        <input type="number" class="form-control" id="molarity-volume" placeholder="Kosongkan jika dicari" step="0.0001">
                    </div>
                    <div class="col-md-4 mb-3">
                        <label class="form-label">Molaritas (M)</label>
                        <input type="number" class="form-control" id="molarity-M" placeholder="Kosongkan jika dicari" step="0.0001">
                    </div>
                </div>
                <button class="btn btn-primary" onclick="calculateMolarity()">
                    <i class="bi bi-calculate"></i> Hitung
                </button>
                <div id="molarity-result"></div>
            </div>
        </div>
    `;
}

function getDilutionMenu() {
    return `
        <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
                <h5 class="mb-0"><i class="bi bi-arrow-down-circle"></i> Pengenceran Larutan (M1V1 = M2V2)</h5>
            </div>
            <div class="card-body">
                <p class="text-muted">Masukkan 3 dari 4 variabel (kosongkan yang dicari)</p>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">M1 (M)</label>
                        <input type="number" class="form-control" id="dilution-M1" placeholder="Kosongkan jika dicari" step="0.0001">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">V1 (mL)</label>
                        <input type="number" class="form-control" id="dilution-V1" placeholder="Kosongkan jika dicari" step="0.0001">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">M2 (M)</label>
                        <input type="number" class="form-control" id="dilution-M2" placeholder="Kosongkan jika dicari" step="0.0001">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">V2 (mL)</label>
                        <input type="number" class="form-control" id="dilution-V2" placeholder="Kosongkan jika dicari" step="0.0001">
                    </div>
                </div>
                <button class="btn btn-primary" onclick="calculateDilution()">
                    <i class="bi bi-calculate"></i> Hitung
                </button>
                <div id="dilution-result"></div>
            </div>
        </div>
    `;
}

function getMassPercentMenu() {
    return `
        <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
                <h5 class="mb-0"><i class="bi bi-percent"></i> Persen Massa</h5>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label class="form-label">Massa zat terlarut (gram)</label>
                    <input type="number" class="form-control" id="mass-percent-zat" placeholder="Masukkan massa zat terlarut" step="0.0001">
                </div>
                <div class="mb-3">
                    <label class="form-label">Massa larutan (gram)</label>
                    <input type="number" class="form-control" id="mass-percent-larutan" placeholder="Masukkan massa larutan" step="0.0001">
                </div>
                <button class="btn btn-primary" onclick="calculateMassPercent()">
                    <i class="bi bi-calculate"></i> Hitung
                </button>
                <div id="mass-percent-result"></div>
            </div>
        </div>
    `;
}

function getStoichiometryMenu() {
    return `
        <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
                <h5 class="mb-0"><i class="bi bi-arrow-right-circle"></i> Stoikiometri</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Nama Reaktan</label>
                        <input type="text" class="form-control" id="stoich-reactant-name" placeholder="Contoh: H2">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Mol Reaktan</label>
                        <input type="number" class="form-control" id="stoich-mol-reactant" placeholder="Masukkan mol" step="0.0001">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Koefisien Reaktan</label>
                        <input type="number" class="form-control" id="stoich-coef-reactant" placeholder="Masukkan koefisien" step="1">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Nama Produk</label>
                        <input type="text" class="form-control" id="stoich-product-name" placeholder="Contoh: H2O">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Koefisien Produk</label>
                        <input type="number" class="form-control" id="stoich-coef-product" placeholder="Masukkan koefisien" step="1">
                    </div>
                </div>
                <button class="btn btn-primary" onclick="calculateStoichiometry()">
                    <i class="bi bi-calculate"></i> Hitung
                </button>
                <div id="stoichiometry-result"></div>
            </div>
        </div>
    `;
}

function getLimitingMenu() {
    return `
        <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
                <h5 class="mb-0"><i class="bi bi-stop-circle"></i> Pereaksi Pembatas</h5>
            </div>
            <div class="card-body">
                <h6>Pereaksi 1:</h6>
                <div class="row mb-3">
                    <div class="col-md-4 mb-2">
                        <label class="form-label">Nama</label>
                        <input type="text" class="form-control" id="limiting-name-A" placeholder="Contoh: H2">
                    </div>
                    <div class="col-md-4 mb-2">
                        <label class="form-label">Mol</label>
                        <input type="number" class="form-control" id="limiting-mol-A" placeholder="Masukkan mol" step="0.0001">
                    </div>
                    <div class="col-md-4 mb-2">
                        <label class="form-label">Koefisien</label>
                        <input type="number" class="form-control" id="limiting-coef-A" placeholder="Masukkan koefisien" step="1">
                    </div>
                </div>
                <h6>Pereaksi 2:</h6>
                <div class="row mb-3">
                    <div class="col-md-4 mb-2">
                        <label class="form-label">Nama</label>
                        <input type="text" class="form-control" id="limiting-name-B" placeholder="Contoh: O2">
                    </div>
                    <div class="col-md-4 mb-2">
                        <label class="form-label">Mol</label>
                        <input type="number" class="form-control" id="limiting-mol-B" placeholder="Masukkan mol" step="0.0001">
                    </div>
                    <div class="col-md-4 mb-2">
                        <label class="form-label">Koefisien</label>
                        <input type="number" class="form-control" id="limiting-coef-B" placeholder="Masukkan koefisien" step="1">
                    </div>
                </div>
                <button class="btn btn-primary" onclick="calculateLimiting()">
                    <i class="bi bi-calculate"></i> Hitung
                </button>
                <div id="limiting-result"></div>
            </div>
        </div>
    `;
}

// Fungsi toggle dan perhitungan untuk menu-menu baru
function toggleCombinedGasInputs() {
    const type = document.getElementById('combined-gas-type').value;
    const inputsDiv = document.getElementById('combined-gas-inputs');
    
    if (type === 'general') {
        inputsDiv.innerHTML = `
            <p class="text-muted">Masukkan 5 dari 6 variabel (kosongkan yang dicari)</p>
            <h6>Kondisi Awal:</h6>
            <div class="row">
                <div class="col-md-4 mb-3">
                    <label class="form-label">P1 (atm)</label>
                    <input type="number" class="form-control" id="combined-P1" placeholder="Kosongkan jika dicari" step="0.0001">
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">V1 (liter)</label>
                    <input type="number" class="form-control" id="combined-V1" placeholder="Kosongkan jika dicari" step="0.0001">
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">T1 (Kelvin)</label>
                    <input type="number" class="form-control" id="combined-T1" placeholder="Kosongkan jika dicari" step="0.0001">
                </div>
            </div>
            <h6>Kondisi Akhir:</h6>
            <div class="row">
                <div class="col-md-4 mb-3">
                    <label class="form-label">P2 (atm)</label>
                    <input type="number" class="form-control" id="combined-P2" placeholder="Kosongkan jika dicari" step="0.0001">
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">V2 (liter)</label>
                    <input type="number" class="form-control" id="combined-V2" placeholder="Kosongkan jika dicari" step="0.0001">
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">T2 (Kelvin)</label>
                    <input type="number" class="form-control" id="combined-T2" placeholder="Kosongkan jika dicari" step="0.0001">
                </div>
            </div>
        `;
    } else if (type === 'isothermal') {
        inputsDiv.innerHTML = `
            <p class="text-muted">Masukkan 3 dari 4 variabel (kosongkan yang dicari)</p>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">P1 (atm)</label>
                    <input type="number" class="form-control" id="combined-P1" placeholder="Kosongkan jika dicari" step="0.0001">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">V1 (liter)</label>
                    <input type="number" class="form-control" id="combined-V1" placeholder="Kosongkan jika dicari" step="0.0001">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">P2 (atm)</label>
                    <input type="number" class="form-control" id="combined-P2" placeholder="Kosongkan jika dicari" step="0.0001">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">V2 (liter)</label>
                    <input type="number" class="form-control" id="combined-V2" placeholder="Kosongkan jika dicari" step="0.0001">
                </div>
            </div>
        `;
    } else if (type === 'isobaric') {
        inputsDiv.innerHTML = `
            <p class="text-muted">Masukkan 3 dari 4 variabel (kosongkan yang dicari)</p>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">V1 (liter)</label>
                    <input type="number" class="form-control" id="combined-V1" placeholder="Kosongkan jika dicari" step="0.0001">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">T1 (Kelvin)</label>
                    <input type="number" class="form-control" id="combined-T1" placeholder="Kosongkan jika dicari" step="0.0001">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">V2 (liter)</label>
                    <input type="number" class="form-control" id="combined-V2" placeholder="Kosongkan jika dicari" step="0.0001">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">T2 (Kelvin)</label>
                    <input type="number" class="form-control" id="combined-T2" placeholder="Kosongkan jika dicari" step="0.0001">
                </div>
            </div>
        `;
    } else if (type === 'isochoric') {
        inputsDiv.innerHTML = `
            <p class="text-muted">Masukkan 3 dari 4 variabel (kosongkan yang dicari)</p>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">P1 (atm)</label>
                    <input type="number" class="form-control" id="combined-P1" placeholder="Kosongkan jika dicari" step="0.0001">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">T1 (Kelvin)</label>
                    <input type="number" class="form-control" id="combined-T1" placeholder="Kosongkan jika dicari" step="0.0001">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">P2 (atm)</label>
                    <input type="number" class="form-control" id="combined-P2" placeholder="Kosongkan jika dicari" step="0.0001">
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">T2 (Kelvin)</label>
                    <input type="number" class="form-control" id="combined-T2" placeholder="Kosongkan jika dicari" step="0.0001">
                </div>
            </div>
        `;
    }
}

function calculateIdealGas() {
    try {
        const P = parseFloat(document.getElementById('ideal-P').value) || null;
        const V = parseFloat(document.getElementById('ideal-V').value) || null;
        const n = parseFloat(document.getElementById('ideal-n').value) || null;
        const T = parseFloat(document.getElementById('ideal-T').value) || null;
        
        const count = [P, V, n, T].filter(x => x !== null).length;
        if (count !== 3) {
            showCustomAlert('Masukkan tepat 3 dari 4 variabel!');
            return;
        }
        
        const result = calc.ideal_gas_law(P, V, n, T);
        const steps = calc.show_steps();
        
        let resultText = '';
        if (P === null) resultText = `P = ${result.toFixed(4)} atm`;
        else if (V === null) resultText = `V = ${result.toFixed(4)} liter`;
        else if (n === null) resultText = `n = ${result.toFixed(4)} mol`;
        else if (T === null) resultText = `T = ${result.toFixed(4)} K`;
        
        document.getElementById('ideal-gas-result').innerHTML = `
            <div class="result-box mt-4">
                <h5><i class="bi bi-check-circle"></i> Hasil Akhir</h5>
                <p class="h4 mb-0">${resultText}</p>
            </div>
            <div class="steps-box mt-3">
                <h6><i class="bi bi-list-ol"></i> Langkah-langkah Perhitungan:</h6>
                <pre>${steps}</pre>
            </div>
        `;
    } catch (error) {
        document.getElementById('ideal-gas-result').innerHTML = `
            <div class="alert alert-danger mt-3">
                <i class="bi bi-exclamation-triangle"></i> ${error.message}
            </div>
        `;
    }
}

function calculateCombinedGas() {
    try {
        const type = document.getElementById('combined-gas-type').value;
        let result, steps, resultText = '';
        
        if (type === 'general') {
            const P1 = parseFloat(document.getElementById('combined-P1').value) || null;
            const V1 = parseFloat(document.getElementById('combined-V1').value) || null;
            const T1 = parseFloat(document.getElementById('combined-T1').value) || null;
            const P2 = parseFloat(document.getElementById('combined-P2').value) || null;
            const V2 = parseFloat(document.getElementById('combined-V2').value) || null;
            const T2 = parseFloat(document.getElementById('combined-T2').value) || null;
            
            const count = [P1, V1, T1, P2, V2, T2].filter(x => x !== null).length;
            if (count !== 5) {
                showCustomAlert('Masukkan tepat 5 dari 6 variabel!');
                return;
            }
            
            result = calc.combined_gas_law(P1, V1, T1, P2, V2, T2);
            steps = calc.show_steps();
            
            if (P1 === null) resultText = `P1 = ${result.toFixed(4)} atm`;
            else if (V1 === null) resultText = `V1 = ${result.toFixed(4)} liter`;
            else if (T1 === null) resultText = `T1 = ${result.toFixed(4)} K`;
            else if (P2 === null) resultText = `P2 = ${result.toFixed(4)} atm`;
            else if (V2 === null) resultText = `V2 = ${result.toFixed(4)} liter`;
            else if (T2 === null) resultText = `T2 = ${result.toFixed(4)} K`;
        } else if (type === 'isothermal') {
            const P1 = parseFloat(document.getElementById('combined-P1').value) || null;
            const V1 = parseFloat(document.getElementById('combined-V1').value) || null;
            const P2 = parseFloat(document.getElementById('combined-P2').value) || null;
            const V2 = parseFloat(document.getElementById('combined-V2').value) || null;
            
            const count = [P1, V1, P2, V2].filter(x => x !== null).length;
            if (count !== 3) {
                showCustomAlert('Masukkan tepat 3 dari 4 variabel!');
                return;
            }
            
            result = calc.isothermal_process(P1, V1, P2, V2);
            steps = calc.show_steps();
            
            if (P1 === null) resultText = `P1 = ${result.toFixed(4)} atm`;
            else if (V1 === null) resultText = `V1 = ${result.toFixed(4)} liter`;
            else if (P2 === null) resultText = `P2 = ${result.toFixed(4)} atm`;
            else if (V2 === null) resultText = `V2 = ${result.toFixed(4)} liter`;
        } else if (type === 'isobaric') {
            const V1 = parseFloat(document.getElementById('combined-V1').value) || null;
            const T1 = parseFloat(document.getElementById('combined-T1').value) || null;
            const V2 = parseFloat(document.getElementById('combined-V2').value) || null;
            const T2 = parseFloat(document.getElementById('combined-T2').value) || null;
            
            const count = [V1, T1, V2, T2].filter(x => x !== null).length;
            if (count !== 3) {
                showCustomAlert('Masukkan tepat 3 dari 4 variabel!');
                return;
            }
            
            result = calc.isobaric_process(V1, T1, V2, T2);
            steps = calc.show_steps();
            
            if (V1 === null) resultText = `V1 = ${result.toFixed(4)} liter`;
            else if (T1 === null) resultText = `T1 = ${result.toFixed(4)} K`;
            else if (V2 === null) resultText = `V2 = ${result.toFixed(4)} liter`;
            else if (T2 === null) resultText = `T2 = ${result.toFixed(4)} K`;
        } else if (type === 'isochoric') {
            const P1 = parseFloat(document.getElementById('combined-P1').value) || null;
            const T1 = parseFloat(document.getElementById('combined-T1').value) || null;
            const P2 = parseFloat(document.getElementById('combined-P2').value) || null;
            const T2 = parseFloat(document.getElementById('combined-T2').value) || null;
            
            const count = [P1, T1, P2, T2].filter(x => x !== null).length;
            if (count !== 3) {
                showCustomAlert('Masukkan tepat 3 dari 4 variabel!');
                return;
            }
            
            result = calc.isochoric_process(P1, T1, P2, T2);
            steps = calc.show_steps();
            
            if (P1 === null) resultText = `P1 = ${result.toFixed(4)} atm`;
            else if (T1 === null) resultText = `T1 = ${result.toFixed(4)} K`;
            else if (P2 === null) resultText = `P2 = ${result.toFixed(4)} atm`;
            else if (T2 === null) resultText = `T2 = ${result.toFixed(4)} K`;
        }
        
        document.getElementById('combined-gas-result').innerHTML = `
            <div class="result-box mt-4">
                <h5><i class="bi bi-check-circle"></i> Hasil Akhir</h5>
                <p class="h4 mb-0">${resultText}</p>
            </div>
            <div class="steps-box mt-3">
                <h6><i class="bi bi-list-ol"></i> Langkah-langkah Perhitungan:</h6>
                <pre>${steps}</pre>
            </div>
        `;
    } catch (error) {
        document.getElementById('combined-gas-result').innerHTML = `
            <div class="alert alert-danger mt-3">
                <i class="bi bi-exclamation-triangle"></i> ${error.message}
            </div>
        `;
    }
}

function calculateMolarity() {
    try {
        const mol = parseFloat(document.getElementById('molarity-mol').value) || null;
        const volume = parseFloat(document.getElementById('molarity-volume').value) || null;
        const M = parseFloat(document.getElementById('molarity-M').value) || null;
        
        const count = [mol, volume, M].filter(x => x !== null).length;
        if (count !== 2) {
            showCustomAlert('Masukkan tepat 2 dari 3 variabel!');
            return;
        }
        
        const result = calc.molarity(mol, volume, M);
        const steps = calc.show_steps();
        
        let resultText = '';
        if (M === null) resultText = `M = ${result.toFixed(4)} M`;
        else if (mol === null) resultText = `n = ${result.toFixed(4)} mol`;
        else if (volume === null) resultText = `V = ${result.toFixed(4)} liter`;
        
        document.getElementById('molarity-result').innerHTML = `
            <div class="result-box mt-4">
                <h5><i class="bi bi-check-circle"></i> Hasil Akhir</h5>
                <p class="h4 mb-0">${resultText}</p>
            </div>
            <div class="steps-box mt-3">
                <h6><i class="bi bi-list-ol"></i> Langkah-langkah Perhitungan:</h6>
                <pre>${steps}</pre>
            </div>
        `;
    } catch (error) {
        document.getElementById('molarity-result').innerHTML = `
            <div class="alert alert-danger mt-3">
                <i class="bi bi-exclamation-triangle"></i> ${error.message}
            </div>
        `;
    }
}

function calculateDilution() {
    try {
        const M1 = parseFloat(document.getElementById('dilution-M1').value) || null;
        const V1 = parseFloat(document.getElementById('dilution-V1').value) || null;
        const M2 = parseFloat(document.getElementById('dilution-M2').value) || null;
        const V2 = parseFloat(document.getElementById('dilution-V2').value) || null;
        
        const count = [M1, V1, M2, V2].filter(x => x !== null).length;
        if (count !== 3) {
            showCustomAlert('Masukkan tepat 3 dari 4 variabel!');
            return;
        }
        
        const result = calc.dilution(M1, V1, M2, V2);
        const steps = calc.show_steps();
        
        let resultText = '';
        if (M1 === null) resultText = `M1 = ${result.toFixed(4)} M`;
        else if (V1 === null) resultText = `V1 = ${result.toFixed(4)} mL`;
        else if (M2 === null) resultText = `M2 = ${result.toFixed(4)} M`;
        else if (V2 === null) resultText = `V2 = ${result.toFixed(4)} mL`;
        
        document.getElementById('dilution-result').innerHTML = `
            <div class="result-box mt-4">
                <h5><i class="bi bi-check-circle"></i> Hasil Akhir</h5>
                <p class="h4 mb-0">${resultText}</p>
            </div>
            <div class="steps-box mt-3">
                <h6><i class="bi bi-list-ol"></i> Langkah-langkah Perhitungan:</h6>
                <pre>${steps}</pre>
            </div>
        `;
    } catch (error) {
        document.getElementById('dilution-result').innerHTML = `
            <div class="alert alert-danger mt-3">
                <i class="bi bi-exclamation-triangle"></i> ${error.message}
            </div>
        `;
    }
}

function calculateMassPercent() {
    try {
        const mass_zat = parseFloat(document.getElementById('mass-percent-zat').value);
        const mass_larutan = parseFloat(document.getElementById('mass-percent-larutan').value);
        
        if (isNaN(mass_zat) || isNaN(mass_larutan)) {
            showCustomAlert('Masukkan nilai yang valid!');
            return;
        }
        
        const result = calc.mass_percent(mass_zat, mass_larutan);
        const steps = calc.show_steps();
        
        document.getElementById('mass-percent-result').innerHTML = `
            <div class="result-box mt-4">
                <h5><i class="bi bi-check-circle"></i> Hasil Akhir</h5>
                <p class="h4 mb-0">${result.toFixed(2)}%</p>
            </div>
            <div class="steps-box mt-3">
                <h6><i class="bi bi-list-ol"></i> Langkah-langkah Perhitungan:</h6>
                <pre>${steps}</pre>
            </div>
        `;
    } catch (error) {
        document.getElementById('mass-percent-result').innerHTML = `
            <div class="alert alert-danger mt-3">
                <i class="bi bi-exclamation-triangle"></i> ${error.message}
            </div>
        `;
    }
}

function calculateStoichiometry() {
    try {
        const reactant_name = document.getElementById('stoich-reactant-name').value.trim();
        const mol_reactant = parseFloat(document.getElementById('stoich-mol-reactant').value);
        const coef_reactant = parseInt(document.getElementById('stoich-coef-reactant').value);
        const product_name = document.getElementById('stoich-product-name').value.trim();
        const coef_product = parseInt(document.getElementById('stoich-coef-product').value);
        
        if (!reactant_name || !product_name || isNaN(mol_reactant) || isNaN(coef_reactant) || isNaN(coef_product)) {
            showCustomAlert('Lengkapi semua field!');
            return;
        }
        
        const result = calc.stoichiometry(mol_reactant, coef_reactant, coef_product, reactant_name, product_name);
        const steps = calc.show_steps();
        
        document.getElementById('stoichiometry-result').innerHTML = `
            <div class="result-box mt-4">
                <h5><i class="bi bi-check-circle"></i> Hasil Akhir</h5>
                <p class="h4 mb-0">Mol ${product_name} = ${result.toFixed(4)} mol</p>
            </div>
            <div class="steps-box mt-3">
                <h6><i class="bi bi-list-ol"></i> Langkah-langkah Perhitungan:</h6>
                <pre>${steps}</pre>
            </div>
        `;
    } catch (error) {
        document.getElementById('stoichiometry-result').innerHTML = `
            <div class="alert alert-danger mt-3">
                <i class="bi bi-exclamation-triangle"></i> ${error.message}
            </div>
        `;
    }
}

function calculateLimiting() {
    try {
        const name_A = document.getElementById('limiting-name-A').value.trim();
        const mol_A = parseFloat(document.getElementById('limiting-mol-A').value);
        const coef_A = parseInt(document.getElementById('limiting-coef-A').value);
        const name_B = document.getElementById('limiting-name-B').value.trim();
        const mol_B = parseFloat(document.getElementById('limiting-mol-B').value);
        const coef_B = parseInt(document.getElementById('limiting-coef-B').value);
        
        if (!name_A || !name_B || isNaN(mol_A) || isNaN(coef_A) || isNaN(mol_B) || isNaN(coef_B)) {
            showCustomAlert('Lengkapi semua field!');
            return;
        }
        
        const { limiting } = calc.limiting_reactant(mol_A, coef_A, mol_B, coef_B, name_A, name_B);
        const steps = calc.show_steps();
        
        document.getElementById('limiting-result').innerHTML = `
            <div class="result-box mt-4">
                <h5><i class="bi bi-check-circle"></i> Hasil Akhir</h5>
                <p class="h4 mb-0">Pereaksi pembatas adalah ${limiting}</p>
            </div>
            <div class="steps-box mt-3">
                <h6><i class="bi bi-list-ol"></i> Langkah-langkah Perhitungan:</h6>
                <pre>${steps}</pre>
            </div>
        `;
    } catch (error) {
        document.getElementById('limiting-result').innerHTML = `
            <div class="alert alert-danger mt-3">
                <i class="bi bi-exclamation-triangle"></i> ${error.message}
            </div>
        `;
    }
}

// Inisialisasi combined gas inputs saat pertama kali
document.addEventListener('DOMContentLoaded', function() {
    // Event listener akan dipanggil saat menu ditampilkan
});

