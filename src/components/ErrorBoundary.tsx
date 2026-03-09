import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props { children: ReactNode }
interface State { error: Error | null }

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#030810',
          color: '#00c8ff',
          fontFamily: 'monospace',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px',
          gap: '16px',
        }}>
          <div style={{ fontSize: '2rem' }}>⚠</div>
          <div style={{ fontFamily: 'Orbitron, monospace', letterSpacing: '.2em', fontSize: '1rem' }}>
            RENDER ERROR
          </div>
          <pre style={{
            background: '#060f20',
            border: '1px solid #0e2035',
            borderRadius: '8px',
            padding: '16px',
            maxWidth: '600px',
            overflowX: 'auto',
            fontSize: '.75rem',
            color: '#ff2d6b',
          }}>
            {this.state.error.toString()}
          </pre>
          <button
            onClick={() => this.setState({ error: null })}
            style={{
              fontFamily: 'Orbitron, monospace',
              fontSize: '.75rem',
              letterSpacing: '.15em',
              padding: '10px 28px',
              border: '1px solid #00c8ff',
              background: 'transparent',
              color: '#00c8ff',
              cursor: 'pointer',
              borderRadius: '6px',
            }}
          >
            RETRY
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
