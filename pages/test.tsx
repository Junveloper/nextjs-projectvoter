import React, { useEffect, useRef } from "react";
import QrScanner from "qr-scanner";

const QRScanner: React.FC = () => {
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const qrScannerRef = useRef<QrScanner | null>(null);

	useEffect(() => {
		if (videoRef.current) {
			qrScannerRef.current = new QrScanner(
				videoRef.current,
				(result: string) => {
					console.log("QR code scanned:", result);
				}
			);
			qrScannerRef.current.start();
		}

		return () => {
			if (qrScannerRef.current) {
				qrScannerRef.current.stop();
			}
		};
	}, []);

	return (
		<div>
			<video ref={videoRef}></video>
		</div>
	);
};

export default QRScanner;
