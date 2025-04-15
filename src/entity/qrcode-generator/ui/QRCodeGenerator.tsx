import { useEffect, useRef } from "react"
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
    id: string
}

export const QRCodeGenerator = ({id}: QRCodeGeneratorProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if(canvasRef.current) {
            QRCode.toCanvas(canvasRef.current, id, {width: 250}, (error) => {
                if (error) {
                    console.error('Ошибка генерации QR-кода:', error);
                }
            })
        }
    }, [id])

    return <canvas ref={canvasRef}/>
}