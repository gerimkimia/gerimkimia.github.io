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
    
    // Only add listeners if overlay exists (not all pages have custom alert)
    if (overlay) {
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
    }
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

let selectedDatabase = 'scholar';

function selectDatabase(db) {
    selectedDatabase = db;
    document.querySelectorAll('.database-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-db="${db}"]`).classList.add('active');
}

function handleSearch(event) {
    event.preventDefault();
    const query = document.getElementById('searchInput').value.trim();
    
    if (!query) {
        return;
    }

    // Show loading
    document.getElementById('resultsContainer').innerHTML = `
        <div class="loading">
            <i class="bi bi-arrow-repeat"></i>
            <p style="margin-top: 15px;">Mencari jurnal...</p>
        </div>
    `;

    // Redirect to search engine based on selected database
    setTimeout(() => {
        let searchUrl = '';
        
        switch(selectedDatabase) {
            case 'scholar':
                searchUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`;
                break;
            case 'pubmed':
                searchUrl = `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(query)}`;
                break;
            case 'ieee':
                searchUrl = `https://ieeexplore.ieee.org/search/searchresult.jsp?queryText=${encodeURIComponent(query)}`;
                break;
            case 'springer':
                searchUrl = `https://link.springer.com/search?query=${encodeURIComponent(query)}`;
                break;
            default:
                searchUrl = `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`;
        }

        // Show results with link
        document.getElementById('resultsContainer').innerHTML = `
            <div class="result-card">
                <div class="result-title">
                    <i class="bi bi-check-circle-fill" style="color: #28a745;"></i> Pencarian Siap!
                </div>
                <p style="margin: 20px 0; color: #666;">
                    Klik tombol di bawah untuk membuka hasil pencarian di ${getDatabaseName(selectedDatabase)}:
                </p>
                <a href="${searchUrl}" target="_blank" class="search-btn" style="display: inline-block; text-decoration: none;">
                    <i class="bi bi-box-arrow-up-right"></i> Buka Hasil Pencarian
                </a>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
                    <p style="color: #888; font-size: 0.9rem;">
                        <i class="bi bi-info-circle"></i> 
                        Tips: Gunakan kata kunci yang spesifik untuk hasil yang lebih akurat. 
                        Contoh: "machine learning" AND "neural network" untuk mencari jurnal yang mengandung kedua istilah tersebut.
                    </p>
                </div>
            </div>
        `;
    }, 1000);
}

function getDatabaseName(db) {
    const names = {
        'scholar': 'Google Scholar',
        'pubmed': 'PubMed',
        'ieee': 'IEEE Xplore',
        'springer': 'Springer'
    };
    return names[db] || 'Google Scholar';
}

// Allow Enter key to search
// document.getElementById('searchInput').addEventListener('keypress', function(e) {
//     if (e.key === 'Enter') {
//         handleSearch(e);
//     }
// });

// ============================================
// AI LEAA CHAT FUNCTIONALITY
// ============================================

// Only initialize if we're on the AI Leaa page
if (document.getElementById('chatMessages')) {
    // ============================================
    // KONFIGURASI API AI
    // ============================================
    const API_CONFIG = {
        // Pilih provider: 'openai' atau 'gemini'
        provider: 'gemini',
        
        // OpenAI Configuration
        openai: {
            apiKey: 'YOUR_OPENAI_API_KEY_HERE',
            model: 'gpt-3.5-turbo',
            endpoint: 'https://api.openai.com/v1/chat/completions'
        },
        
        // Google Gemini Configuration
        gemini: {
            apiKey: 'AIzaSyCWCG9gR05IMdHuJ0QFKS8tshjALXdVgRs',
            model: 'gemini-2.0-flash',
            endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
        }
    };

    // Chat history untuk context
    let chatHistory = [
        {
            role: 'system',
            content: 'Kamu adalah AI Leaa, asisten AI yang ramah dan membantu. Kamu dibuat khusus untuk membantu Leaa dengan berbagai pertanyaan. Jawab dengan ramah, jelas, dan dalam bahasa Indonesia.'
        }
    ];

    // Current conversation ID
    let currentConversationId = null;
    let conversations = [];
    let isSaving = false; // Flag to prevent race condition

    // Variables for stop functionality
    let isTyping = false;
    let typingController = null;
    let currentTypingPromise = null;

    // DOM Elements
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const chatForm = document.getElementById('chatForm');
    const sendBtn = document.getElementById('sendBtn');
    const typingIndicator = document.getElementById('typingIndicator');
    const welcomeMessage = document.querySelector('.welcome-message');

    // Load all conversations from localStorage
    function loadConversations() {
        try {
            const saved = localStorage.getItem('aileaa_conversations');
            if (saved) {
                conversations = JSON.parse(saved);
                renderConversationsList();
            }
        } catch (error) {
            console.error('Error loading conversations:', error);
            conversations = [];
        }
    }

    // Save all conversations to localStorage
    function saveConversations() {
        try {
            localStorage.setItem('aileaa_conversations', JSON.stringify(conversations));
        } catch (error) {
            console.error('Error saving conversations:', error);
        }
    }

    // Generate unique conversation ID
    function generateConversationId() {
        return 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Save chat history to current conversation
    function saveChatHistory() {
        if (isSaving) return; // Prevent race condition
        isSaving = true;
        
        try {
            // Deep copy chatHistory to prevent reference sharing
            const historyCopy = JSON.parse(JSON.stringify(chatHistory));
            
            if (currentConversationId) {
                const index = conversations.findIndex(c => c.id === currentConversationId);
                if (index !== -1) {
                    conversations[index].history = historyCopy;
                    conversations[index].updatedAt = new Date().toISOString();
                    saveConversations();
                }
            } else if (chatHistory.length > 1) {
                // Auto-save to new conversation if there are messages
                const newId = generateConversationId();
                conversations.push({
                    id: newId,
                    name: 'Percakapan Baru',
                    history: historyCopy,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
                currentConversationId = newId;
                saveConversations();
                renderConversationsList();
                
                // Auto-generate title after first few messages
                if (chatHistory.length >= 3) {
                    generateConversationTitle(newId);
                }
            }
        } finally {
            isSaving = false;
        }
    }

    // Generate conversation title using AI
    async function generateConversationTitle(conversationId) {
        try {
            // Get first few user messages for context
            const userMessages = chatHistory
                .filter(msg => msg.role === 'user')
                .slice(0, 3)
                .map(msg => msg.content)
                .join('\n');
            
            if (!userMessages || userMessages.length < 10) return; // Too short
            
            // Create a prompt for title generation
            const titlePrompt = `Berdasarkan percakapan berikut, buatkan judul yang singkat dan deskriptif (maksimal 5 kata) dalam bahasa Indonesia:\n\n${userMessages}\n\nJudul:`;
            
            // Use AI to generate title
            const tempHistory = [
                { role: 'system', content: 'Kamu adalah asisten yang membantu membuat judul percakapan. Jawab hanya dengan judul saja, tanpa penjelasan tambahan.' },
                { role: 'user', content: titlePrompt }
            ];
            
            let title = 'Percakapan Baru';
            
            if (API_CONFIG.provider === 'openai' && API_CONFIG.openai.apiKey && API_CONFIG.openai.apiKey !== 'YOUR_OPENAI_API_KEY_HERE') {
                const response = await fetch(API_CONFIG.openai.endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${API_CONFIG.openai.apiKey}`
                    },
                    body: JSON.stringify({
                        model: API_CONFIG.openai.model,
                        messages: tempHistory,
                        temperature: 0.7,
                        max_tokens: 20
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    title = data.choices[0].message.content.trim();
                }
            } else if (API_CONFIG.provider === 'gemini' && API_CONFIG.gemini.apiKey && API_CONFIG.gemini.apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
                const url = `${API_CONFIG.gemini.endpoint}?key=${API_CONFIG.gemini.apiKey}`;
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            role: 'user',
                            parts: [{ text: titlePrompt }]
                        }]
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    title = data.candidates[0].content.parts[0].text.trim();
                }
            }
            
            // Clean title: remove markdown, quotes, and extra whitespace
            title = title
                .replace(/\*\*/g, '') // Remove bold markdown **
                .replace(/\*/g, '') // Remove italic markdown *
                .replace(/`/g, '') // Remove code markdown `
                .replace(/["']/g, '') // Remove quotes
                .replace(/^#+\s*/, '') // Remove markdown headers
                .replace(/\n.*/g, '') // Remove everything after first line
                .trim();
            
            // Limit to 5 words max
            const words = title.split(/\s+/);
            if (words.length > 5) {
                title = words.slice(0, 5).join(' ');
            }
            
            // Fallback if title is empty or too short
            if (!title || title.length < 2) {
                title = 'Percakapan Baru';
            }
            
            // Update conversation title
            const index = conversations.findIndex(c => c.id === conversationId);
            if (index !== -1) {
                conversations[index].name = title;
                saveConversations();
                renderConversationsList();
                
                // Update UI if this is the current conversation
                if (currentConversationId === conversationId) {
                    const nameEl = document.getElementById('currentConversationName');
                    if (nameEl) nameEl.textContent = title;
                }
            }
        } catch (error) {
            console.error('Error generating title:', error);
            // Silently fail, keep default title
        }
    }

    // Render conversations list
    function renderConversationsList() {
        const list = document.getElementById('conversationsList');
        if (!list) return;
        
        if (conversations.length === 0) {
            list.innerHTML = `
                <div class="empty-conversations">
                    <i class="bi bi-inbox"></i>
                    <p>Belum ada percakapan</p>
                    <p style="font-size: 0.85rem; margin-top: 10px;">Klik "Percakapan Baru" untuk memulai</p>
                </div>
            `;
            return;
        }

        list.innerHTML = conversations.map(conv => {
            const safeId = conv.id.replace(/'/g, "\\'");
            const safeName = escapeHtml(conv.name);
            return `
            <div class="conversation-item ${conv.id === currentConversationId ? 'active' : ''}" 
                 onclick="loadConversation('${safeId}')">
                <div class="conversation-name" title="${safeName}">${safeName}</div>
                <div class="conversation-actions" onclick="event.stopPropagation()">
                    <button class="conversation-action-btn" onclick="deleteConversation('${safeId}')" title="Hapus">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
        }).join('');
    }

    // Create new conversation
    window.createNewConversation = function() {
        // Save current conversation if it has messages
        if (chatHistory.length > 1 && currentConversationId) {
            saveCurrentConversationSilent();
        }

        // Reset to new conversation
        currentConversationId = null;
        chatHistory = [
            {
                role: 'system',
                content: 'Kamu adalah AI Leaa, asisten AI yang ramah dan membantu. Kamu dibuat khusus untuk membantu Leaa dengan berbagai pertanyaan. Jawab dengan ramah, jelas, dan dalam bahasa Indonesia.'
            }
        ];

        // Clear UI
        chatMessages.innerHTML = '';
        const welcomeMsg = document.createElement('div');
        welcomeMsg.className = 'welcome-message';
        welcomeMsg.innerHTML = `
            <i class="bi bi-chat-heart-fill"></i>
            <h3>Halo! Saya AI Leaa</h3>
            <p>Saya di sini untuk membantu kamu. Tanyakan apa saja yang ingin kamu ketahui! 💕</p>
        `;
        chatMessages.appendChild(welcomeMsg);

        const nameEl = document.getElementById('currentConversationName');
        if (nameEl) nameEl.textContent = 'Percakapan Baru';
        renderConversationsList();
        
        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            if (sidebar) sidebar.classList.remove('open');
            if (overlay) overlay.classList.remove('active');
        }
    };

    // Load conversation
    window.loadConversation = function(conversationId) {
        if (isSaving) {
            // Wait a bit if saving is in progress
            setTimeout(() => loadConversation(conversationId), 100);
            return;
        }
        
        const conversation = conversations.find(c => c.id === conversationId);
        if (!conversation) return;

        // Save current conversation if it has messages
        if (chatHistory.length > 1 && currentConversationId && currentConversationId !== conversationId) {
            saveCurrentConversationSilent();
        }

        currentConversationId = conversationId;
        // Deep copy to prevent reference sharing
        chatHistory = JSON.parse(JSON.stringify(conversation.history));

        // Clear and render messages
        chatMessages.innerHTML = '';
        const welcomeMsg = document.querySelector('.welcome-message');
        if (welcomeMsg) welcomeMsg.remove();

        // Display all messages except system message (with skipHistory flag to prevent adding to chatHistory)
        chatHistory.slice(1).forEach(msg => {
            addMessage(msg.content, msg.role === 'user', false, true); // true = skipHistory
        });

        const nameEl = document.getElementById('currentConversationName');
        if (nameEl) nameEl.textContent = conversation.name;
        renderConversationsList();
        
        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            if (sidebar) sidebar.classList.remove('open');
            if (overlay) overlay.classList.remove('active');
        }
    };

    // Save current conversation
    function saveCurrentConversationSilent() {
        if (isSaving || chatHistory.length <= 1) return;
        isSaving = true;
        
        try {
            // Deep copy to prevent reference sharing
            const historyCopy = JSON.parse(JSON.stringify(chatHistory));
            
            const name = currentConversationId 
                ? conversations.find(c => c.id === currentConversationId)?.name || 'Percakapan'
                : 'Percakapan Baru';

            if (currentConversationId) {
                const index = conversations.findIndex(c => c.id === currentConversationId);
                if (index !== -1) {
                    conversations[index].history = historyCopy;
                    conversations[index].updatedAt = new Date().toISOString();
                }
            } else {
                const newId = generateConversationId();
                conversations.push({
                    id: newId,
                    name: name,
                    history: historyCopy,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
                currentConversationId = newId;
            }

            saveConversations();
        } finally {
            isSaving = false;
        }
    }

    // Show save modal
    // Custom confirm function
    function showCustomConfirm(message, title = 'Konfirmasi', onConfirm, onCancel) {
        const overlay = document.createElement('div');
        overlay.className = 'custom-alert-overlay';
        overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center;';
        
        const alertBox = document.createElement('div');
        alertBox.className = 'custom-alert';
        alertBox.style.cssText = 'background: white; padding: 30px; border-radius: 15px; max-width: 400px; width: 90%; box-shadow: 0 10px 40px rgba(0,0,0,0.3);';
        alertBox.innerHTML = `
            <h3 style="margin: 0 0 15px 0; color: #ff4b6e; font-size: 1.3rem;">${title}</h3>
            <p style="margin: 0 0 20px 0; color: #333; line-height: 1.6;">${message}</p>
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button class="custom-alert-btn-cancel" style="padding: 10px 20px; border: 2px solid #e0e0e0; background: white; border-radius: 8px; cursor: pointer; font-weight: 600; color: #666;">Batal</button>
                <button class="custom-alert-btn-confirm" style="padding: 10px 20px; border: none; background: #ff4b6e; color: white; border-radius: 8px; cursor: pointer; font-weight: 600;">Ya</button>
            </div>
        `;
        
        overlay.appendChild(alertBox);
        document.body.appendChild(overlay);
        
        const closeAlert = () => {
            document.body.removeChild(overlay);
        };
        
        alertBox.querySelector('.custom-alert-btn-confirm').onclick = () => {
            closeAlert();
            if (onConfirm) onConfirm();
        };
        
        alertBox.querySelector('.custom-alert-btn-cancel').onclick = () => {
            closeAlert();
            if (onCancel) onCancel();
        };
        
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                closeAlert();
                if (onCancel) onCancel();
            }
        };
    }

    window.showSaveModal = function() {
        if (chatHistory.length <= 1) {
            showCustomAlert('Tidak ada pesan untuk disimpan!', 'Peringatan');
            return;
        }

        const modal = document.getElementById('saveModal');
        const input = document.getElementById('conversationNameInput');
        if (!modal || !input) return;
        
        if (currentConversationId) {
            const conv = conversations.find(c => c.id === currentConversationId);
            input.value = conv ? conv.name : '';
        } else {
            input.value = '';
        }

        modal.classList.add('show');
        input.focus();

        // Close on overlay click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeSaveModal();
            }
        });

        // Enter key to save
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                saveCurrentConversation();
            }
        });
    };

    // Close save modal
    window.closeSaveModal = function() {
        const modal = document.getElementById('saveModal');
        const input = document.getElementById('conversationNameInput');
        if (modal) modal.classList.remove('show');
        if (input) input.value = '';
    };

    // Save current conversation with name
    window.saveCurrentConversation = function() {
        const input = document.getElementById('conversationNameInput');
        if (!input) return;
        
        const name = input.value.trim();
        if (!name) {
            showCustomAlert('Masukkan nama percakapan!', 'Peringatan');
            return;
        }

        if (chatHistory.length <= 1) {
            showCustomAlert('Tidak ada pesan untuk disimpan!', 'Peringatan');
            return;
        }

        if (currentConversationId) {
            const index = conversations.findIndex(c => c.id === currentConversationId);
            if (index !== -1) {
                // Deep copy to prevent reference sharing
                const historyCopy = JSON.parse(JSON.stringify(chatHistory));
                conversations[index].name = name;
                conversations[index].history = historyCopy;
                conversations[index].updatedAt = new Date().toISOString();
            }
        } else {
            const newId = 'conv_' + Date.now();
            conversations.push({
                id: newId,
                name: name,
                history: [...chatHistory],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            currentConversationId = newId;
        }

        saveConversations();
        renderConversationsList();
        closeSaveModal();
        const nameEl = document.getElementById('currentConversationName');
        if (nameEl) nameEl.textContent = name;
    };

    // Delete conversation
    window.deleteConversation = function(conversationId) {
        showCustomConfirm(
            'Apakah kamu yakin ingin menghapus percakapan ini?',
            'Hapus Percakapan',
            () => {
                conversations = conversations.filter(c => c.id !== conversationId);
                
                if (currentConversationId === conversationId) {
                    createNewConversation();
                }

                saveConversations();
                renderConversationsList();
            }
        );
    };

    // Toggle sidebar (mobile)
    window.toggleSidebar = function() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        if (sidebar) sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('active');
    };

    // Reset chat history
    window.resetChatHistory = function() {
        showCustomConfirm(
            'Apakah kamu yakin ingin menghapus riwayat chat ini?',
            'Hapus Riwayat',
            () => {
                chatHistory = [
                {
                    role: 'system',
                    content: 'Kamu adalah AI Leaa, asisten AI yang ramah dan membantu. Kamu dibuat khusus untuk membantu Leaa dengan berbagai pertanyaan. Jawab dengan ramah, jelas, dan dalam bahasa Indonesia.'
                }
            ];
            chatMessages.innerHTML = '';
            const welcomeMsg = document.createElement('div');
            welcomeMsg.className = 'welcome-message';
            welcomeMsg.innerHTML = `
                <i class="bi bi-chat-heart-fill"></i>
                <h3>Halo! Saya AI Leaa</h3>
                <p>Saya di sini untuk membantu kamu. Tanyakan apa saja yang ingin kamu ketahui! 💕</p>
            `;
            chatMessages.appendChild(welcomeMsg);
            
                // Update conversation if exists
                if (currentConversationId) {
                    const index = conversations.findIndex(c => c.id === currentConversationId);
                    if (index !== -1) {
                        // Deep copy to prevent reference sharing
                        const historyCopy = JSON.parse(JSON.stringify(chatHistory));
                        conversations[index].history = historyCopy;
                        saveConversations();
                    }
                }
                
                const nameEl = document.getElementById('currentConversationName');
                if (nameEl) nameEl.textContent = 'Percakapan Baru';
            }
        );
    };

    // Limit chat history
    function limitChatHistory() {
        const MAX_HISTORY = 20;
        if (chatHistory.length > MAX_HISTORY) {
            const systemMsg = chatHistory[0];
            const recentMessages = chatHistory.slice(-MAX_HISTORY);
            chatHistory = [systemMsg, ...recentMessages];
        }
    }

    // Setup form and input event listeners
    function setupChatInputListeners() {
        // Get elements again to ensure they exist
        const formEl = document.getElementById('chatForm');
        const inputEl = document.getElementById('chatInput');
        
        if (!formEl || !inputEl) {
            console.error('Chat form or input not found');
            return;
        }

        // Prevent form submission
        try {
            formEl.addEventListener('submit', function(event) {
                event.preventDefault();
                event.stopPropagation();
                if (window.handleSendMessage) {
                    window.handleSendMessage(event);
                }
                return false;
            }, false);
        } catch (error) {
            console.error('Error setting up form event listener:', error);
        }

        // Auto-resize textarea with max-height
        try {
            inputEl.addEventListener('input', function() {
                // Reset height to auto to get the correct scrollHeight
                this.style.height = 'auto';
                
                // Calculate the new height based on content
                const scrollHeight = this.scrollHeight;
                const maxHeight = 200; // Match CSS max-height
                
                // Set height, but don't exceed max-height
                if (scrollHeight <= maxHeight) {
                    this.style.height = scrollHeight + 'px';
                    this.style.overflowY = 'hidden';
                } else {
                    this.style.height = maxHeight + 'px';
                    this.style.overflowY = 'auto';
                }
            });
            
            // Handle Enter key directly on textarea
            inputEl.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    event.stopPropagation();
                    if (window.handleSendMessage) {
                        window.handleSendMessage(event);
                    }
                    return false;
                }
            });
            
            // Also handle on load to set initial height
            if (inputEl.value) {
                inputEl.dispatchEvent(new Event('input'));
            }
        } catch (error) {
            console.error('Error setting up chatInput event listener:', error);
        }
    }

    // Call setup after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupChatInputListeners);
    } else {
        setupChatInputListeners();
    }

    // Handle Enter key (for backward compatibility with onkeydown attribute)
    window.handleKeyDown = function(event) {
        if (!event) return false;
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            event.stopPropagation();
            if (window.handleSendMessage) {
                window.handleSendMessage(event);
            }
            return false;
        }
        return true;
    };

    // Scroll to bottom
    function scrollToBottom() {
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    // Escape HTML
    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    // Format inline markdown
    function formatInlineMarkdown(text) {
        return text
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, '<em>$1</em>');
    }

    // Extract and format code blocks
    function formatCodeBlocks(text, knownCodeBlocks = null) {
        const codeBlockRegex = /```(\w+)?\s*\n?([\s\S]*?)```/g;
        const codeBlocks = [];
        let blockIndex = 0;
        
        let formatted = text.replace(codeBlockRegex, (match, lang, code) => {
            const cleanLang = (lang || 'text').trim();
            const cleanCode = code.trim();
            
            let id;
            if (knownCodeBlocks) {
                const found = knownCodeBlocks.find(cb => 
                    cb.lang === cleanLang && cb.code === cleanCode
                );
                if (found) {
                    id = found.id;
                }
            }
            
            if (!id) {
                id = `code-block-${Date.now()}-${blockIndex++}`;
            }
            
            codeBlocks.push({ id, lang: cleanLang, code: cleanCode });
            return `<div class="code-block-wrapper" data-code-id="${id}"></div>`;
        });
        
        return { formatted, codeBlocks };
    }

    // Convert markdown-like text to HTML
    function formatMessage(text, knownCodeBlocks = null) {
        if (!text) return { html: '', codeBlocks: [] };
        
        const { formatted, codeBlocks } = formatCodeBlocks(text, knownCodeBlocks);
        const lines = formatted.split('\n');
        const processedLines = [];
        let inList = false;
        
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            const trimmedLine = line.trim();
            
            if (line.includes('code-block-wrapper')) {
                processedLines.push(line);
                continue;
            }
            
            const isListItem = /^[\*\-\•]\s+/.test(trimmedLine) || /^\d+\.\s+/.test(trimmedLine);
            
            if (isListItem) {
                if (!inList) {
                    processedLines.push('<ul>');
                    inList = true;
                }
                line = line.replace(/^[\*\-\•]\s+/, '').replace(/^\d+\.\s+/, '');
                line = formatInlineMarkdown(line);
                processedLines.push(`<li>${line}</li>`);
            } else {
                if (inList) {
                    processedLines.push('</ul>');
                    inList = false;
                }
                line = formatInlineMarkdown(line);
                if (line.trim()) {
                    processedLines.push(line);
                } else {
                    processedLines.push('<br>');
                }
            }
        }
        
        if (inList) {
            processedLines.push('</ul>');
        }
        
        return { html: processedLines.join('\n'), codeBlocks };
    }

    // Render code blocks with copy button
    function renderCodeBlocks(container, codeBlocks) {
        codeBlocks.forEach(({ id, lang, code }) => {
            const wrapper = container.querySelector(`[data-code-id="${id}"]`);
            if (wrapper) {
                const escapedCode = escapeHtml(code);
                const safeId = id.replace(/'/g, "\\'").replace(/"/g, '&quot;');
                
                wrapper.outerHTML = `
                    <div class="code-block-container">
                        <div class="code-block-header">
                            <span class="code-block-lang">${lang}</span>
                            <button class="copy-code-btn" onclick="window.copyCode('${safeId}')" title="Copy code">
                                <i class="bi bi-clipboard"></i> Copy
                            </button>
                        </div>
                        <pre class="code-block"><code id="${safeId}">${escapedCode}</code></pre>
                    </div>
                `;
            }
        });
    }

    // Copy code to clipboard
    window.copyCode = function(codeId) {
        const codeElement = document.getElementById(codeId);
        if (!codeElement) return;
        
        const code = codeElement.textContent;
        navigator.clipboard.writeText(code).then(() => {
            const container = codeElement.closest('.code-block-container');
            if (container) {
                const btn = container.querySelector('.copy-code-btn');
                if (btn) {
                    const originalHTML = btn.innerHTML;
                    btn.innerHTML = '<i class="bi bi-check"></i> Copied!';
                    btn.style.background = '#28a745';
                    
                    setTimeout(() => {
                        btn.innerHTML = originalHTML;
                        btn.style.background = '';
                    }, 2000);
                }
            }
            }).catch(err => {
            console.error('Failed to copy:', err);
            showCustomAlert('Gagal menyalin kode. Silakan salin manual.', 'Error');
        });
    };

    // Show typing indicator
    function showTyping() {
        if (typingIndicator) {
            typingIndicator.classList.add('active');
            typingIndicator.style.display = 'inline-block';
            chatMessages.appendChild(typingIndicator);
            scrollToBottom();
        }
    }

    // Hide typing indicator
    function hideTyping() {
        if (typingIndicator) {
            typingIndicator.classList.remove('active');
            typingIndicator.style.display = 'none';
        }
    }

    // Stop typing animation
    window.stopTyping = function() {
        isTyping = false;
        if (typingController) {
            typingController.abort();
            typingController = null;
        }
        hideTyping();
        hideStopButton();
        
        // Re-enable input
        if (chatInput) chatInput.disabled = false;
        if (sendBtn) sendBtn.disabled = false;
    };

    // Show stop button
    function showStopButton() {
        const form = document.getElementById('chatForm');
        if (!form) return;
        
        let stopBtn = document.getElementById('stopBtn');
        if (!stopBtn) {
            stopBtn = document.createElement('button');
            stopBtn.type = 'button';
            stopBtn.id = 'stopBtn';
            stopBtn.className = 'stop-btn';
            stopBtn.innerHTML = '<i class="bi bi-stop-fill"></i> Stop';
            stopBtn.onclick = stopTyping;
            form.appendChild(stopBtn);
        }
        stopBtn.style.display = 'flex';
        if (sendBtn) sendBtn.style.display = 'none';
    }

    // Hide stop button
    function hideStopButton() {
        const stopBtn = document.getElementById('stopBtn');
        if (stopBtn) stopBtn.style.display = 'none';
        if (sendBtn) sendBtn.style.display = 'flex';
    }

    // Typing animation with stop support
    async function typeMessage(fullText, contentElement) {
        isTyping = true;
        typingController = new AbortController();
        showStopButton();
        
        const codeBlockRegex = /```(\w+)?\s*\n?([\s\S]*?)```/g;
        const codeBlockPositions = [];
        let match;
        let blockIndex = 0;
        
        codeBlockRegex.lastIndex = 0;
        while ((match = codeBlockRegex.exec(fullText)) !== null) {
            codeBlockPositions.push({
                start: match.index,
                end: match.index + match[0].length,
                lang: (match[1] || 'text').trim(),
                code: match[2].trim(),
                id: `code-block-${Date.now()}-${blockIndex++}`
            });
        }
        
        codeBlockPositions.sort((a, b) => a.start - b.start);
        
        const segments = [];
        let lastPos = 0;
        
        for (const codeBlock of codeBlockPositions) {
            if (codeBlock.start > lastPos) {
                segments.push({
                    type: 'text',
                    content: fullText.substring(lastPos, codeBlock.start)
                });
            }
            
            segments.push({
                type: 'code',
                content: codeBlock.code,
                lang: codeBlock.lang,
                id: codeBlock.id
            });
            
            lastPos = codeBlock.end;
        }
        
        if (lastPos < fullText.length) {
            segments.push({
                type: 'text',
                content: fullText.substring(lastPos)
            });
        }
        
        if (segments.length === 0) {
            segments.push({
                type: 'text',
                content: fullText
            });
        }
        
        contentElement.innerHTML = '';
        const renderedCodeBlocks = [];
        let segmentIndex = 0;
        
        for (const segment of segments) {
            if (!isTyping) break;
            
            if (segment.type === 'text') {
                const textContent = segment.content;
                
                for (let i = 0; i <= textContent.length; i++) {
                    if (!isTyping) break;
                    
                    let textSoFar = '';
                    let codeBlocksSoFar = [];
                    
                    for (let j = 0; j < segmentIndex; j++) {
                        const seg = segments[j];
                        if (seg.type === 'text') {
                            textSoFar += seg.content;
                        } else {
                            textSoFar += `\`\`\`${seg.lang}\n${seg.content}\n\`\`\``;
                            codeBlocksSoFar.push({
                                id: seg.id,
                                lang: seg.lang,
                                code: seg.content
                            });
                        }
                    }
                    
                    textSoFar += segment.content.substring(0, i);
                    
                    const { html, codeBlocks } = formatMessage(textSoFar, codeBlocksSoFar);
                    contentElement.innerHTML = html;
                    renderCodeBlocks(contentElement, codeBlocks);
                    scrollToBottom();
                    
                    if (i < textContent.length) {
                        const char = textContent[i];
                        let delay = 15;
                        if (char === ' ') delay = 5;
                        else if (char === '.' || char === '!' || char === '?') delay = 80;
                        else if (char === ',' || char === ';') delay = 40;
                        else if (char === '\n') delay = 20;
                        
                        await new Promise((resolve, reject) => {
                            if (typingController.signal.aborted) {
                                reject(new Error('Stopped'));
                                return;
                            }
                            setTimeout(resolve, delay);
                            typingController.signal.addEventListener('abort', () => reject(new Error('Stopped')));
                        }).catch(() => {
                            isTyping = false;
                        });
                    }
                }
            } else {
                if (!isTyping) break;
                
                renderedCodeBlocks.push({
                    id: segment.id,
                    lang: segment.lang,
                    code: segment.content
                });
                
                let textSoFar = '';
                for (let j = 0; j <= segmentIndex; j++) {
                    const seg = segments[j];
                    if (seg.type === 'text') {
                        textSoFar += seg.content;
                    } else {
                        textSoFar += `\`\`\`${seg.lang}\n${seg.content}\n\`\`\``;
                    }
                }
                
                const { html, codeBlocks } = formatMessage(textSoFar, renderedCodeBlocks);
                contentElement.innerHTML = html;
                renderCodeBlocks(contentElement, codeBlocks);
                scrollToBottom();
                
                if (isTyping) {
                    await new Promise((resolve, reject) => {
                        if (typingController.signal.aborted) {
                            reject(new Error('Stopped'));
                            return;
                        }
                        setTimeout(resolve, 100);
                        typingController.signal.addEventListener('abort', () => reject(new Error('Stopped')));
                    }).catch(() => {
                        isTyping = false;
                    });
                }
            }
            
            segmentIndex++;
        }
        
        if (isTyping) {
            const { html: fullHTML, codeBlocks: allCodeBlocks } = formatMessage(fullText);
            contentElement.innerHTML = fullHTML;
            renderCodeBlocks(contentElement, allCodeBlocks);
        }
        
        isTyping = false;
        typingController = null;
        hideStopButton();
        scrollToBottom();
    }

    // Add message to chat
    async function addMessage(text, isUser, animate = false, skipHistory = false) {
        if (welcomeMessage && welcomeMessage.parentNode) {
            welcomeMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'ai'}`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = isUser ? '<i class="bi bi-person-fill"></i>' : '<i class="bi bi-robot"></i>';

        const content = document.createElement('div');
        content.className = 'message-content';
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        chatMessages.appendChild(messageDiv);

        if (isUser) {
            content.textContent = text;
            // Add user message to chatHistory if not already added and not skipping
            if (!skipHistory) {
                // Ensure chatHistory exists
                if (!chatHistory || chatHistory.length === 0) {
                    chatHistory = [{
                        role: 'system',
                        content: 'Kamu adalah AI Leaa, asisten AI yang ramah dan membantu. Kamu dibuat khusus untuk membantu Leaa dengan berbagai pertanyaan. Jawab dengan ramah, jelas, dan dalam bahasa Indonesia.'
                    }];
                }
                const lastMessage = chatHistory[chatHistory.length - 1];
                if (!lastMessage || lastMessage.content !== text || lastMessage.role !== 'user') {
                    chatHistory.push({
                        role: 'user',
                        content: text
                    });
                }
            }
            scrollToBottom();
        } else {
            if (animate) {
                await typeMessage(text, content);
            } else {
                const { html, codeBlocks } = formatMessage(text);
                content.innerHTML = html;
                renderCodeBlocks(content, codeBlocks);
            }
            // Add AI message to chatHistory if not already added and not skipping
            if (!skipHistory) {
                const lastMessage = chatHistory[chatHistory.length - 1];
                if (!lastMessage || lastMessage.content !== text || lastMessage.role !== 'assistant') {
                    chatHistory.push({
                        role: 'assistant',
                        content: text
                    });
                }
            }
            scrollToBottom();
        }
        
        if (!skipHistory) {
            saveChatHistory();
            
            // Auto-generate title after 3 messages (1 user + 1 AI + 1 user)
            if (chatHistory.length >= 4 && currentConversationId) {
                const conv = conversations.find(c => c.id === currentConversationId);
                if (conv && conv.name === 'Percakapan Baru') {
                    generateConversationTitle(currentConversationId);
                }
            }
        }
    }

    // Get AI Response from API (no fallback)
    async function getAIResponse(userMessage) {
        // Ensure chatHistory is not empty (should have at least system message + user message)
        if (!chatHistory || chatHistory.length < 2) {
            console.error('Chat history is too short or undefined:', chatHistory);
            // Try to ensure system message exists
            if (!chatHistory || chatHistory.length === 0) {
                chatHistory = [{
                    role: 'system',
                    content: 'Kamu adalah AI Leaa, asisten AI yang ramah dan membantu. Kamu dibuat khusus untuk membantu Leaa dengan berbagai pertanyaan. Jawab dengan ramah, jelas, dan dalam bahasa Indonesia.'
                }];
            }
            // If still less than 2, add the user message
            if (chatHistory.length < 2 && userMessage) {
                chatHistory.push({
                    role: 'user',
                    content: userMessage
                });
            }
            if (!chatHistory || chatHistory.length < 2) {
                throw new Error('Chat history tidak lengkap. Silakan coba lagi.');
            }
        }
        
        // Check if API key is configured
        if (API_CONFIG.provider === 'openai') {
            if (!API_CONFIG.openai.apiKey || API_CONFIG.openai.apiKey === 'YOUR_OPENAI_API_KEY_HERE') {
                throw new Error('API key OpenAI belum dikonfigurasi. Silakan set API key di Library/script.js');
            }
            return await getOpenAIResponse();
        } else if (API_CONFIG.provider === 'gemini') {
            if (!API_CONFIG.gemini.apiKey || API_CONFIG.gemini.apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
                throw new Error('API key Gemini belum dikonfigurasi. Silakan set API key di Library/script.js');
            }
            return await getGeminiResponse();
        } else {
            throw new Error('Provider API belum dikonfigurasi. Silakan set provider ke "openai" atau "gemini" di Library/script.js');
        }
    }

    // OpenAI API Call
    async function getOpenAIResponse() {
        const response = await fetch(API_CONFIG.openai.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_CONFIG.openai.apiKey}`
            },
            body: JSON.stringify({
                model: API_CONFIG.openai.model,
                messages: chatHistory,
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Error dari OpenAI API');
        }

        const data = await response.json();
        const aiMessage = data.choices[0].message.content;

        // Don't add to chatHistory here - addMessage will handle it
        limitChatHistory();
        return aiMessage;
    }

    // Google Gemini API Call
    async function getGeminiResponse() {
        const url = `${API_CONFIG.gemini.endpoint}?key=${API_CONFIG.gemini.apiKey}`;
        
        const contents = chatHistory
            .filter(msg => msg.role !== 'system')
            .map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            }));

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: contents
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Error dari Gemini API');
        }

        const data = await response.json();
        const aiMessage = data.candidates[0].content.parts[0].text;

        // Don't add to chatHistory here - addMessage will handle it
        limitChatHistory();
        return aiMessage;
    }

    // Handle send message
    window.handleSendMessage = async function(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        // Get elements again to ensure they exist
        const chatInputEl = document.getElementById('chatInput');
        const sendBtnEl = document.getElementById('sendBtn');
        
        if (!chatInputEl || !sendBtnEl) {
            console.error('Chat input elements not found');
            if (event) event.preventDefault();
            return false;
        }
        
        const message = chatInputEl.value.trim();
        if (!message) {
            return false;
        }

        // Disable input
        chatInputEl.disabled = true;
        sendBtnEl.disabled = true;

        try {
            // Add user message (will add to chatHistory in addMessage)
            await addMessage(message, true);

            // Clear input
            chatInputEl.value = '';
            chatInputEl.style.height = 'auto';

            // Ensure chatHistory is properly updated before calling API
            // Wait a bit to ensure chatHistory is fully updated
            await new Promise(resolve => setTimeout(resolve, 50));
            
            // Verify chatHistory has at least system + user message
            if (chatHistory.length < 2) {
                console.error('Chat history is too short after adding message:', chatHistory);
                throw new Error('Chat history tidak lengkap. Silakan coba lagi.');
            }

            // Show typing indicator
            showTyping();

            // Get AI response from API (chatHistory already includes user message from addMessage above)
            const aiResponse = await getAIResponse(message);
            hideTyping();
            
            // Add AI message with typing animation
            await addMessage(aiResponse, false, true);
        } catch (error) {
            hideTyping();
            console.error('Error in handleSendMessage:', error);
            await addMessage(`Maaf, terjadi kesalahan: ${error.message}`, false, true);
        } finally {
            // Re-enable input
            if (chatInputEl) chatInputEl.disabled = false;
            if (sendBtnEl) sendBtnEl.disabled = false;
            if (chatInputEl) chatInputEl.focus();
        }
        
        return false;
    };

    // Load conversations on page load
    window.addEventListener('load', () => {
        loadConversations();
        if (chatInput) chatInput.focus();
    });

    // Close sidebar when clicking outside (mobile)
    document.addEventListener('click', function(e) {
        const sidebar = document.getElementById('sidebar');
        const toggle = document.getElementById('sidebarToggle');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target) && e.target !== toggle && !toggle.contains(e.target) && e.target !== overlay) {
                sidebar.classList.remove('open');
                if (overlay) overlay.classList.remove('active');
            }
        }
    });
}

