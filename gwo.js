import { performanceFunction } from './fitness.js';

class GreyWolf {
    constructor(nDimensi, objFunction) {
        this.objFunction = objFunction;
        this.nDimensi = nDimensi;
        this.position = Array(nDimensi).fill(0);
        this.velocity = Array(nDimensi).fill(0);
        this.alphaPosition = Array(nDimensi).fill(0);
        this.alphaFitness = -Infinity;
        this.betaPosition = Array(nDimensi).fill(0);
        this.betaFitness = -Infinity;
        this.deltaPosition = Array(nDimensi).fill(0);
        this.deltaFitness = -Infinity;
    }

    inisialisasiPosisi(min, max) {
        this.position[0] = 0; // Indeks Surabaya, selalu dimulai dari sini
        let visitedCities = [0]; // Kota yang sudah dikunjungi
        for (let i = 1; i < this.nDimensi; i++) {
            let newCity;
            do {
                newCity = Math.floor(Math.random() * (max - min + 1)) + min;
            } while (visitedCities.includes(newCity)); // Pastikan kota belum dikunjungi
            this.position[i] = newCity;
            visitedCities.push(newCity); // Tambahkan kota yang sudah dikunjungi
        }
    }

    calculateFitness() {
        this.fitness = this.objFunction(...this.position);
        console.log(`Posisi: ${this.position}, Fitness: ${this.fitness}`);
    }

    updatePosition() {
        let visitedCities = [this.position[0]]; // Kota yang sudah dikunjungi
        for (let i = 1; i < this.nDimensi; i++) {
            // Pastikan kota yang baru tidak terduplikasi
            let newPosition = Math.floor(Math.random() * this.nDimensi);
            while (visitedCities.includes(newPosition)) {
                newPosition = Math.floor(Math.random() * this.nDimensi); // Pilih kota baru
            }
            this.position[i] = newPosition;
            visitedCities.push(newPosition); // Tandai kota yang sudah dikunjungi
        }
    }

    updateAlphaBetaDelta() {
        if (this.fitness > this.alphaFitness) {
            this.deltaFitness = this.betaFitness;
            this.deltaPosition = [...this.betaPosition];
            this.betaFitness = this.alphaFitness;
            this.betaPosition = [...this.alphaPosition];
            this.alphaFitness = this.fitness;
            this.alphaPosition = [...this.position];
        } else if (this.fitness > this.betaFitness) {
            this.deltaFitness = this.betaFitness;
            this.deltaPosition = [...this.betaPosition];
            this.betaFitness = this.fitness;
            this.betaPosition = [...this.position];
        } else if (this.fitness > this.deltaFitness) {
            this.deltaFitness = this.fitness;
            this.deltaPosition = [...this.position];
        }
    }

    updateVelocity(alpha, beta, delta, a) {
        for (let i = 0; i < this.nDimensi; i++) {
            const A1 = 2 * a * Math.random() - a;
            const C1 = 2 * Math.random();
            const Dalpha = Math.abs(C1 * this.alphaPosition[i] - this.position[i]);
            const X1 = this.alphaPosition[i] - A1 * Dalpha;

            const A2 = 2 * a * Math.random() - a;
            const C2 = 2 * Math.random();
            const Dbeta = Math.abs(C2 * this.betaPosition[i] - this.position[i]);
            const X2 = this.betaPosition[i] - A2 * Dbeta;

            const A3 = 2 * a * Math.random() - a;
            const C3 = 2 * Math.random();
            const Ddelta = Math.abs(C3 * this.deltaPosition[i] - this.position[i]);
            const X3 = this.deltaPosition[i] - A3 * Ddelta;

            this.velocity[i] = (X1 + X2 + X3) / 3;
        }
    }
}

class GWO {
    constructor(nParticles, nDimensi) {
        this.nParticles = nParticles;
        this.particles = [];
        this.nDimensi = nDimensi;
        this.alphaFitness = -Infinity;
        this.alphaPosition = Array(nDimensi).fill(0);
        this.initParticles();
    }

    initParticles() {
        for (let i = 0; i < this.nParticles; i++) {
            const particle = new GreyWolf(this.nDimensi, performanceFunction);
            particle.inisialisasiPosisi(0, 5);
            this.particles.push(particle);
        }
    }

    evaluateFitness() {
        this.particles.forEach((particle) => {
            particle.calculateFitness();
        });
    }

    updatePosition() {
        this.particles.forEach((particle) => {
            particle.updatePosition();
        });
    }

    updateAlphaBetaDelta() {
        this.particles.forEach((particle) => {
            particle.updateAlphaBetaDelta();
        });

        this.particles.forEach((particle) => {
            if (particle.alphaFitness > this.alphaFitness) {
                this.alphaFitness = particle.alphaFitness;
                this.alphaPosition = [...particle.alphaPosition];
            }
        });
    }

    mainGWO(a) {
        this.evaluateFitness();
        this.updateAlphaBetaDelta();
        this.updatePosition();
        this.particles.forEach((particle) => {
            particle.updateVelocity(this.alphaPosition, this.alphaFitness, this.alphaPosition, a);
        });
    }
}

export { GWO };
