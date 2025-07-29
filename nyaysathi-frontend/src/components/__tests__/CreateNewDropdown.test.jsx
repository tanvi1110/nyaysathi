import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'

// Mock the CreateNewDropdown component
const CreateNewDropdown = ({ onSelect }) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const [searchTerm, setSearchTerm] = React.useState('')

    const options = [
        { id: 'task', label: 'Create New Task', icon: '📋', description: 'Add a new task to your list' },
        { id: 'event', label: 'Create New Event', icon: '📅', description: 'Schedule a new event' },
        { id: 'contact', label: 'Create New Contact', icon: '👤', description: 'Add a new contact' },
    ]

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleSelect = (option) => {
        onSelect(option.id)
        setIsOpen(false)
        setSearchTerm('')
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2"
            >
                Create new
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-3 border-b border-gray-200">
                        <input
                            type="text"
                            placeholder="Search options..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                    </div>

                    <div className="max-h-60 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleSelect(option)}
                                    className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                >
                                    <span className="text-xl">{option.icon}</span>
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">{option.label}</div>
                                        <div className="text-sm text-gray-500">{option.description}</div>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="p-3 text-center text-gray-500">
                                No options found for "{searchTerm}"
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

describe('CreateNewDropdown Component', () => {
    test('renders create new button', () => {
        const mockOnSelect = jest.fn()
        render(<CreateNewDropdown onSelect={mockOnSelect} />)
        expect(screen.getByText('Create new')).toBeInTheDocument()
    })

    test('opens dropdown when button is clicked', () => {
        const mockOnSelect = jest.fn()
        render(<CreateNewDropdown onSelect={mockOnSelect} />)

        fireEvent.click(screen.getByText('Create new'))

        expect(screen.getByText('Create New Task')).toBeInTheDocument()
        expect(screen.getByText('Create New Event')).toBeInTheDocument()
        expect(screen.getByText('Create New Contact')).toBeInTheDocument()
    })

    test('shows search input when dropdown is open', () => {
        const mockOnSelect = jest.fn()
        render(<CreateNewDropdown onSelect={mockOnSelect} />)

        fireEvent.click(screen.getByText('Create new'))

        expect(screen.getByPlaceholderText('Search options...')).toBeInTheDocument()
    })

    test('filters options when searching', () => {
        const mockOnSelect = jest.fn()
        render(<CreateNewDropdown onSelect={mockOnSelect} />)

        fireEvent.click(screen.getByText('Create new'))

        const searchInput = screen.getByPlaceholderText('Search options...')
        fireEvent.change(searchInput, { target: { value: 'task' } })

        expect(screen.getByText('Create New Task')).toBeInTheDocument()
        expect(screen.queryByText('Create New Event')).not.toBeInTheDocument()
        expect(screen.queryByText('Create New Contact')).not.toBeInTheDocument()
    })

    test('calls onSelect when an option is clicked', () => {
        const mockOnSelect = jest.fn()
        render(<CreateNewDropdown onSelect={mockOnSelect} />)

        fireEvent.click(screen.getByText('Create new'))
        fireEvent.click(screen.getByText('Create New Task'))

        expect(mockOnSelect).toHaveBeenCalledWith('task')
    })

    test('shows all three options: task, event, contact', () => {
        const mockOnSelect = jest.fn()
        render(<CreateNewDropdown onSelect={mockOnSelect} />)

        fireEvent.click(screen.getByText('Create new'))

        // Check all three options are present
        expect(screen.getByText('📋')).toBeInTheDocument()
        expect(screen.getByText('📅')).toBeInTheDocument()
        expect(screen.getByText('👤')).toBeInTheDocument()

        expect(screen.getByText('Add a new task to your list')).toBeInTheDocument()
        expect(screen.getByText('Schedule a new event')).toBeInTheDocument()
        expect(screen.getByText('Add a new contact')).toBeInTheDocument()
    })
}) 