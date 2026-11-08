/**
 * Web Audio API based procedural ambient generator
 * Generates lightweight, zero-download, soothing background audio:
 * - Soothing Gentle Rain (مطر هادئ للتدبر)
 * - Forest Breeze / Wind (حفيف شجر ونسيم)
 * - Night Desert Serenity (سكينة الليل والهدوء)
 */

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private currentMode: string | null = null;
  private sourceNodes: AudioNode[] = [];
  private gainNode: GainNode | null = null;
  private volume: number = 0.3;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public stop() {
    this.sourceNodes.forEach(node => {
      try {
        if ('stop' in node && typeof (node as any).stop === 'function') {
          (node as any).stop();
        }
        node.disconnect();
      } catch {
        // ignore
      }
    });
    this.sourceNodes = [];
    this.currentMode = null;
  }

  public getCurrentMode(): string | null {
    return this.currentMode;
  }

  public play(mode: 'rain' | 'breeze' | 'night' | 'none') {
    if (mode === 'none') {
      this.stop();
      return;
    }

    if (this.currentMode === mode) {
      this.stop();
      return;
    }

    this.stop();
    this.initCtx();
    if (!this.ctx) return;

    this.currentMode = mode;
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);

    // Create pink/brown noise buffer for natural fluid sound
    const bufferSize = this.ctx.sampleRate * 3;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (mode === 'rain') {
        // Pink-ish noise for rain droplets
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      } else if (mode === 'breeze') {
        // Brown noise for wind through trees
        output[i] = (lastOut + 0.015 * white) / 1.015;
        lastOut = output[i];
        output[i] *= 2.8;
      } else {
        // Soft cosmic hum / night silence
        output[i] = (lastOut + 0.005 * white) / 1.005;
        lastOut = output[i];
        output[i] *= 1.5;
      }
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filters to shape acoustic ambience
    const filter = this.ctx.createBiquadFilter();
    if (mode === 'rain') {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, this.ctx.currentTime);
      filter.Q.setValueAtTime(0.5, this.ctx.currentTime);
    } else if (mode === 'breeze') {
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(380, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

      // Low frequency oscillator to make wind ebb and flow
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.15, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(200, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();
      this.sourceNodes.push(lfo, lfoGain);
    } else {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, this.ctx.currentTime);
    }

    whiteNoise.connect(filter);
    filter.connect(this.gainNode);
    whiteNoise.start();

    this.sourceNodes.push(whiteNoise, filter, this.gainNode);
  }
}

export const ambientAudio = new AmbientSoundEngine();
