import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'

// Mock the Timer component from dashboard
const Timer = () => {
    const [time, setTime] = React.useState(0)
    const [isRunning, setIsRunning] = React.useState(false)
    const [currentSession, setCurrentSession] = React.useState('')
    const [sessions, setSessions] = React.useState([])

    React.useEffect(() => {
        let interval = null
        if (isRunning) {
            interval = setInterval(() => {
                setTime(time => time + 1)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [isRunning])

    const startTimer = () => setIsRunning(true)
    const pauseTimer = () => setIsRunning(false)
    const resetTimer = () => {
        setIsRunning(false)
        setTime(0)
    }

    const saveSession = () => {
        if (currentSession.trim()) {
            const newSession = {
                id: Date.now(),
                name: currentSession,
                duration: time
            }
            setSessions(prev => [newSession, ...prev.slice(0, 4)])
            setCurrentSession('')
        }
    }

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600)
        const mins = Math.floor((seconds % 3600) / 60)
        const secs = seconds % 60
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div>
            <div className="text-2xl font-mono mb-4">{formatTime(time)}</div>
            <div className="flex gap-2 mb-4">
                <button onClick={isRunning ? pauseTimer : startTimer}>
                    {isRunning ? 'Pause' : 'Start'}
                </button>
                {time > 0 && (
                    <button onClick={resetTimer}>Reset</button>
                )}
            </div>
            {time > 0 && (
                <div>
                    <input
                        type="text"
                        placeholder="What are you working on?"
                        value={currentSession}
                        onChange={(e) => setCurrentSession(e.target.value)}
                    />
                    <button onClick={saveSession} disabled={!currentSession.trim()}>
                        Save Session
                    </button>
                </div>
            )}
            {sessions.length > 0 && (
                <div>
                    <h4>Recent Sessions</h4>
                    {sessions.map((session) => (
                        <div key={session.id}>
                            <span>{session.name}</span>
                            <span>{formatTime(session.duration)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

describe('Timer Component', () => {
    beforeEach(() => {
        jest.useFakeTimers()
    })

    afterEach(() => {
        jest.runOnlyPendingTimers()
        jest.useRealTimers()
    })

    test('renders timer with initial time', () => {
        render(<Timer />)
        expect(screen.getByText('00:00:00')).toBeInTheDocument()
    })

    test('starts timer when start button is clicked', () => {
        render(<Timer />)

        fireEvent.click(screen.getByText('Start'))

        act(() => {
            jest.advanceTimersByTime(1000)
        })

        expect(screen.getByText('00:00:01')).toBeInTheDocument()
    })

    test('pauses timer when pause button is clicked', () => {
        render(<Timer />)

        fireEvent.click(screen.getByText('Start'))

        act(() => {
            jest.advanceTimersByTime(1000)
        })

        fireEvent.click(screen.getByText('Pause'))

        act(() => {
            jest.advanceTimersByTime(1000)
        })

        expect(screen.getByText('00:00:01')).toBeInTheDocument()
    })

    test('resets timer when reset button is clicked', () => {
        render(<Timer />)

        fireEvent.click(screen.getByText('Start'))

        act(() => {
            jest.advanceTimersByTime(2000)
        })

        fireEvent.click(screen.getByText('Reset'))

        expect(screen.getByText('00:00:00')).toBeInTheDocument()
    })

    test('shows session input when timer is running', () => {
        render(<Timer />)

        fireEvent.click(screen.getByText('Start'))

        act(() => {
            jest.advanceTimersByTime(1000)
        })

        expect(screen.getByPlaceholderText('What are you working on?')).toBeInTheDocument()
    })

    test('saves session when session name is provided', () => {
        render(<Timer />)

        fireEvent.click(screen.getByText('Start'))

        act(() => {
            jest.advanceTimersByTime(5000)
        })

        const sessionInput = screen.getByPlaceholderText('What are you working on?')
        fireEvent.change(sessionInput, { target: { value: 'Test Session' } })

        fireEvent.click(screen.getByText('Save Session'))

        expect(screen.getByText('Test Session')).toBeInTheDocument()
        expect(screen.getAllByText('00:00:05')).toHaveLength(2) // Timer display and session duration
    })
}) 