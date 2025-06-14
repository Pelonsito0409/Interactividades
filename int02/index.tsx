
declare var Vue: any; // Declare Vue as a global variable
declare var gsap: any; // Declare gsap as a global variable

const MAX_VISUAL_DROP_HEIGHT_PX = 360; // Define a constant for max visual height of the drop zone

const app = Vue.createApp({
    data() {
        return {
            heightOptions: [5, 10, 15, 20, 25], // meters
            selectedHeight: null, // meters
            isHeightLocked: false,
            currentTrial: 1,
            maxTrials: 5,
            objectState: 'ready', // 'ready', 'falling', 'stopped', 'experiment_over'
            stopwatch: {
                displayTime: '0.000s',
                startTime: 0,
                intervalId: null,
            },
            measuredTimes: [], // { trial: number, time: number }
            showResultsTable: false,
            showVerificationArea: false,
            verificationData: {
                trueFallTime: 0,
                averageMeasuredTime: 0,
                errors: [], // { trial, measuredTime, absoluteError, relativeError }
                averageAbsoluteError: 0,
                averageRelativeError: 0,
            },
            // PIXELS_PER_METER: 15, // Removed: Will be dynamic based on MAX_VISUAL_DROP_HEIGHT_PX
            GRAVITY: 9.81, // m/s^2
            experimentStarted: false,
            errorMessage: '',
        };
    },
    computed: {
        visualDropHeight() {
            // The drop zone will always try to be MAX_VISUAL_DROP_HEIGHT_PX if a height is selected
            return this.selectedHeight ? MAX_VISUAL_DROP_HEIGHT_PX : 0;
        },
        targetPositionPx() {
            if (!this.selectedHeight) return 0;
            // Target is visually halfway down the scaled drop zone
            return (this.visualDropHeight / 2); 
        },
        trueFallTime() { // Theoretical time to reach the PHYSICAL TARGET (half of selectedHeight)
            if (!this.selectedHeight) return 0;
            const heightToTarget = this.selectedHeight / 2; // Physical height to target
            return Math.sqrt((2 * heightToTarget) / this.GRAVITY);
        },
        canStartDrop() {
            return this.selectedHeight && 
                   (this.objectState === 'ready' || this.objectState === 'stopped') && 
                   this.currentTrial <= this.maxTrials && 
                   !this.showResultsTable &&
                   this.objectState !== 'experiment_over';
        },
        canStopTimer() {
            return this.objectState === 'falling';
        },
        experimentComplete() { 
            return this.objectState === 'experiment_over';
        },
        actionButtonText() {
            if (this.objectState === 'experiment_over') {
                return 'Experimento Finalizado';
            }
            if (this.objectState === 'falling') {
                return 'DETENER EN DIANA';
            }
            if (!this.experimentStarted && this.currentTrial === 1) {
                 if (!this.selectedHeight) return 'Selecciona Altura para Iniciar';
                return 'Iniciar Experimento';
            }
            if (!this.selectedHeight && this.canStartDrop) { 
                 return 'Selecciona Altura';
            }
            return `Iniciar Caída (Ensayo ${this.currentTrial} de ${this.maxTrials})`;
        },
        isActionButtonDisabled() {
            if (this.objectState === 'experiment_over') {
                return true;
            }
            if (this.objectState === 'falling') {
                return !this.canStopTimer; 
            }
            return !this.canStartDrop;
        },
        actionButtonAriaLabel() {
            if (this.objectState === 'experiment_over') {
                return 'El experimento ha finalizado. Reinicie para comenzar de nuevo.';
            }
            if (this.objectState === 'falling') {
                return 'Detener el objeto cuando pase por la diana y registrar el tiempo.';
            }
            if (!this.selectedHeight) {
                 return 'Debe seleccionar una altura de la lista para poder iniciar el experimento o una caída.';
            }
            if (!this.experimentStarted && this.currentTrial === 1) {
                return `Iniciar el experimento con la altura seleccionada de ${this.selectedHeight} metros.`;
            }
            return `Iniciar la caída para el ensayo ${this.currentTrial} de ${this.maxTrials} desde ${this.selectedHeight} metros.`;
        }
    },
    methods: {
        selectHeight(height) {
            if (!this.isHeightLocked) {
                this.selectedHeight = height;
                this.resetObjectPosition(); // Reset position when height changes before experiment starts
                this.errorMessage = ''; 
                if (this.objectState === 'experiment_over') { 
                    this.resetExperiment(); 
                    this.selectedHeight = height; 
                }
            } else if (this.selectedHeight !== height) {
                this.errorMessage = `La altura está bloqueada en ${this.selectedHeight}m. Reinicie el experimento para cambiarla.`;
            }
        },
        handleActionClick() {
            this.errorMessage = ''; // Clear previous errors on action
            if (this.objectState === 'ready' || this.objectState === 'stopped') { // Consolidate start conditions
                if (this.canStartDrop) {
                    this.startDrop();
                } else if (!this.selectedHeight) {
                     this.errorMessage = "Por favor, selecciona una altura antes de iniciar.";
                }
            } else if (this.objectState === 'falling' && this.canStopTimer) {
                this.stopTimer();
            }
        },
        startDrop() {
            if (!this.selectedHeight) { 
                this.errorMessage = "Error: Altura no seleccionada.";
                return;
            }
            this.errorMessage = '';

            if (!this.isHeightLocked) {
                this.isHeightLocked = true;
            }
            this.experimentStarted = true; 
            this.objectState = 'falling';
            this.stopwatch.startTime = performance.now();
            
            if (this.stopwatch.intervalId) {
                clearInterval(this.stopwatch.intervalId);
            }

            this.stopwatch.intervalId = setInterval(() => {
                const elapsedTime = (performance.now() - this.stopwatch.startTime) / 1000;
                this.stopwatch.displayTime = `${elapsedTime.toFixed(3)}s`;
            }, 10); 

            this.resetObjectPosition(); // Ensure object is at y:0 before animation for this trial

            // Theoretical time to hit the PHYSICAL ground (selectedHeight)
            // This duration is used for the animation over the VISUAL drop height
            const timeToGround = Math.sqrt((2 * this.selectedHeight) / this.GRAVITY); 
            
            gsap.to(this.$refs.fallingObject, {
                y: this.visualDropHeight, // Animate to fall the full SCALED visual height
                duration: timeToGround, // Use actual physical time to fall selectedHeight
                ease: 'power1.in', 
                onComplete: () => {
                    // This onComplete implies the user FAILED to stop the timer
                    // and the object visually hit the "ground".
                    // The timer should ideally continue until they click stop, or we auto-stop.
                    // If state is still falling, means they missed.
                    if (this.objectState === 'falling') {
                        // Optionally, auto-stop if it hits ground and wasn't stopped manually
                        // this.stopTimer(); 
                        // For now, let's assume they MUST click stop. If they miss, time will be very long.
                    }
                }
            });
        },
        stopTimer() {
            if (this.objectState !== 'falling') return;

            clearInterval(this.stopwatch.intervalId);
            this.stopwatch.intervalId = null; 
            
            const measuredTime = (performance.now() - this.stopwatch.startTime) / 1000;
            this.stopwatch.displayTime = `${measuredTime.toFixed(3)}s`;

            gsap.killTweensOf(this.$refs.fallingObject); // Stop visual animation at current point. Object stays there.

            this.measuredTimes.push({
                trial: this.currentTrial,
                time: measuredTime,
            });

            this.objectState = 'stopped'; // Object is now stopped, awaiting next action or end of experiment

            if (this.currentTrial >= this.maxTrials) {
                this.showResultsTable = true;
                this.objectState = 'experiment_over'; 
            } else {
                 this.currentTrial++;
                 // DO NOT resetObjectPosition here. It will be reset on the next call to startDrop.
                 // The objectState remains 'stopped' until 'startDrop' is called again,
                 // at which point it becomes 'falling'. Or, it becomes 'ready' if we want to signal can start.
                 // Let's make it 'ready' to allow the button text to update correctly for next trial.
                 this.objectState = 'ready';
            }
        },
        resetObjectPosition() {
            if (this.$refs.fallingObject) {
                 gsap.set(this.$refs.fallingObject, { y: 0 });
            }
        },
        calculateAndShowVerification() {
            if (this.measuredTimes.length === 0) {
                this.errorMessage = "No hay tiempos medidos para verificar.";
                return;
            }
            this.errorMessage = '';
            const trueTimeToTarget = this.trueFallTime; 
            let totalMeasuredTime = 0;
            let totalAbsoluteError = 0;

            this.verificationData.errors = this.measuredTimes.map(record => {
                const absoluteError = Math.abs(record.time - trueTimeToTarget);
                const relativeError = trueTimeToTarget === 0 ? 0 : (absoluteError / trueTimeToTarget) * 100;
                totalMeasuredTime += record.time;
                totalAbsoluteError += absoluteError;
                return {
                    trial: record.trial,
                    measuredTime: record.time,
                    absoluteError: absoluteError,
                    relativeError: relativeError,
                };
            });

            this.verificationData.trueFallTime = trueTimeToTarget;
            this.verificationData.averageMeasuredTime = totalMeasuredTime / this.measuredTimes.length;
            this.verificationData.averageAbsoluteError = totalAbsoluteError / this.measuredTimes.length;
            this.verificationData.averageRelativeError = trueTimeToTarget === 0 ? 0 : (this.verificationData.averageAbsoluteError / trueTimeToTarget) * 100;
            
            this.showVerificationArea = true;
        },
        resetExperiment() {
            if (this.stopwatch.intervalId) {
                 clearInterval(this.stopwatch.intervalId);
                 this.stopwatch.intervalId = null;
            }
            gsap.killTweensOf(this.$refs.fallingObject);

            this.selectedHeight = null; 
            this.isHeightLocked = false;
            this.currentTrial = 1;
            this.objectState = 'ready';
            this.stopwatch.displayTime = '0.000s';
            this.stopwatch.startTime = 0;
            this.measuredTimes = [];
            this.showResultsTable = false;
            this.showVerificationArea = false;
            this.experimentStarted = false;
            this.errorMessage = '';
            
            this.verificationData = { 
                trueFallTime: 0,
                averageMeasuredTime: 0,
                errors: [],
                averageAbsoluteError: 0,
                averageRelativeError: 0,
            };
            this.resetObjectPosition(); 
        },
        initializeExperiment() {
            this.resetObjectPosition(); 
        }
    },
    mounted() {
        this.initializeExperiment();
    }
});

app.mount('#app');
