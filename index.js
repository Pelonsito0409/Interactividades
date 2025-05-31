
document.addEventListener('DOMContentLoaded', () => {
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
                PIXELS_PER_METER: 15, // Visual scaling
                GRAVITY: 9.81, // m/s^2
                experimentStarted: false,
                errorMessage: '',
            };
        },
        computed: {
            visualDropHeight() {
                return this.selectedHeight ? this.selectedHeight * this.PIXELS_PER_METER : 0;
            },
            trueFallTime() {
                if (!this.selectedHeight) return 0;
                return Math.sqrt((2 * this.selectedHeight) / this.GRAVITY);
            },
            canStartDrop() {
                return this.selectedHeight && this.objectState !== 'falling' && this.currentTrial <= this.maxTrials && !this.showResultsTable;
            },
            canStopTimer() {
                return this.objectState === 'falling';
            },
            experimentComplete() {
                return this.currentTrial > this.maxTrials;
            }
        },
        methods: {
            selectHeight(height) {
                if (!this.isHeightLocked) {
                    this.selectedHeight = height;
                    this.resetObjectPosition(); // Reset object if height changes before start
                    this.errorMessage = ''; // Clear any previous error
                }
            },
            startDrop() {
                if (!this.selectedHeight) {
                    this.errorMessage = "Por favor, selecciona una altura antes de iniciar.";
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

                this.resetObjectPosition(); 

                gsap.to(this.$refs.fallingObject, {
                    y: this.visualDropHeight,
                    duration: this.trueFallTime,
                    ease: 'power1.in',
                    onComplete: () => {
                        // Timer continues until user clicks "Stop Timer".
                    }
                });
            },
            stopTimer() {
                if (this.objectState !== 'falling') return;

                clearInterval(this.stopwatch.intervalId);
                this.stopwatch.intervalId = null; 
                
                const measuredTime = (performance.now() - this.stopwatch.startTime) / 1000;
                this.stopwatch.displayTime = `${measuredTime.toFixed(3)}s`;

                this.measuredTimes.push({
                    trial: this.currentTrial,
                    time: measuredTime,
                });

                this.objectState = 'stopped'; 
                this.resetObjectPosition(); 

                if (this.currentTrial >= this.maxTrials) {
                    this.showResultsTable = true;
                    this.objectState = 'experiment_over';
                } else {
                     this.currentTrial++;
                     this.objectState = 'ready';
                }
            },
            resetObjectPosition() {
                if (this.$refs.fallingObject) {
                     gsap.set(this.$refs.fallingObject, { y: 0 });
                }
            },
            calculateAndShowVerification() {
                const trueTime = this.trueFallTime;
                let totalMeasuredTime = 0;
                let totalAbsoluteError = 0;

                this.verificationData.errors = this.measuredTimes.map(record => {
                    const absoluteError = Math.abs(record.time - trueTime);
                    const relativeError = trueTime === 0 ? 0 : (absoluteError / trueTime) * 100;
                    totalMeasuredTime += record.time;
                    totalAbsoluteError += absoluteError;
                    return {
                        trial: record.trial,
                        measuredTime: record.time,
                        absoluteError: absoluteError,
                        relativeError: relativeError,
                    };
                });

                this.verificationData.trueFallTime = trueTime;
                this.verificationData.averageMeasuredTime = this.measuredTimes.length > 0 ? totalMeasuredTime / this.measuredTimes.length : 0;
                this.verificationData.averageAbsoluteError = this.measuredTimes.length > 0 ? totalAbsoluteError / this.measuredTimes.length : 0;
                this.verificationData.averageRelativeError = trueTime === 0 ? 0 : (this.verificationData.averageAbsoluteError / trueTime) * 100;
                
                this.showVerificationArea = true;
            },
            resetExperiment() {
                this.selectedHeight = null;
                this.isHeightLocked = false;
                this.currentTrial = 1;
                this.objectState = 'ready';
                this.stopwatch.displayTime = '0.000s';
                if (this.stopwatch.intervalId) {
                     clearInterval(this.stopwatch.intervalId);
                     this.stopwatch.intervalId = null;
                }
                this.measuredTimes = [];
                this.showResultsTable = false;
                this.showVerificationArea = false;
                this.experimentStarted = false;
                this.errorMessage = '';
                this.resetObjectPosition();
                this.verificationData = {
                    trueFallTime: 0,
                    averageMeasuredTime: 0,
                    errors: [],
                    averageAbsoluteError: 0,
                    averageRelativeError: 0,
                };
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
});
