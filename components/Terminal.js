import React, { useEffect, useRef, useState } from 'react'
import { Terminal } from 'xterm'
import 'xterm/css/xterm.css'
import { getLogsListAPI } from '@/apis/deployment_apis'
import { w3cwebsocket as W3CWebSocket } from 'websocket'
import { DJANGO_BASE_WS } from '@/constants'
import { formatDate } from '@/utils'

const TerminalComponent = ({ deploymentCode, status, lastedDeploy, buildNumber }) => {
  const terminalRef = useRef(null)
  const [logs, setLogs] = useState([])
  const [terminal, setTerminal] = useState(null)

  useEffect(() => {
    getLogsListAPI({ code: deploymentCode }).then(res => {
      setLogs(res.data.logs)
    })
    setTerminal(new Terminal())
    const socket = new W3CWebSocket(`${DJANGO_BASE_WS}/ws/deployment/log/${deploymentCode}`)
    console.log(socket)
    socket.onmessage = (message) => {
      const { log, isReset } = JSON.parse(message.data)
      const newLogs = log.split('\n')
      if (isReset) {
        return setLogs([])
      }
      setLogs([...logs, ...newLogs])
    }
    return () => {
      socket.close()
    }
  }, [])

  useEffect(() => {
    if (!terminal) return
    terminal.open(terminalRef.current)
    terminal.writeln('Welcome!')
    return () => {
      terminal.dispose()
    }
  }, [terminal])

  useEffect(() => {
    if (!terminal) return
    logs.forEach(line => terminal.writeln(line))
  }, [logs])

  return (
    <>
      <div className=''>
        <p className='text-xl font-semibold'>#{buildNumber} - {formatDate(lastedDeploy)}</p>
      </div>
      <div className='w-full' ref={terminalRef} />
    </>
  )
}

export default TerminalComponent
