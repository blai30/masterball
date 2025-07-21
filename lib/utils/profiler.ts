type PerformanceEntry = {
  name: string
  start: number
  end?: number
  duration?: number
}

class PerformanceProfiler {
  private entries: Map<string, PerformanceEntry> = new Map()
  
  start(name: string): void {
    this.entries.set(name, {
      name,
      start: performance.now(),
    })
    console.log(`⏱️  Started: ${name}`)
  }
  
  end(name: string): number {
    const entry = this.entries.get(name)
    if (!entry) {
      console.warn(`Performance entry "${name}" not found`)
      return 0
    }
    
    entry.end = performance.now()
    entry.duration = entry.end - entry.start
    
    console.log(`✅ Completed: ${name} in ${entry.duration.toFixed(2)}ms`)
    return entry.duration
  }
  
  getEntry(name: string): PerformanceEntry | undefined {
    return this.entries.get(name)
  }
  
  getAllEntries(): PerformanceEntry[] {
    return Array.from(this.entries.values())
  }
  
  clear(): void {
    this.entries.clear()
  }
  
  summary(): void {
    console.log('\n📊 Performance Summary:')
    console.log('=' .repeat(50))
    
    const completedEntries = this.getAllEntries().filter(e => e.duration !== undefined)
    if (completedEntries.length === 0) {
      console.log('No completed performance entries found.')
      return
    }
    
    completedEntries
      .sort((a, b) => (b.duration || 0) - (a.duration || 0))
      .forEach(entry => {
        console.log(`${entry.name}: ${entry.duration!.toFixed(2)}ms`)
      })
    
    const total = completedEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0)
    console.log('-'.repeat(50))
    console.log(`Total measured time: ${total.toFixed(2)}ms`)
    console.log('=' .repeat(50))
  }
}

export const profiler = new PerformanceProfiler()
export default profiler