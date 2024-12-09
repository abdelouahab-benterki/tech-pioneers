import React, { useEffect, useRef, useState } from 'react';
import { Paper, Loader, Text } from '@mantine/core';
import * as pdfjsLib from 'pdfjs-dist';
// import { PDFWorker } from 'pdfjs-dist/legacy/build/pdf.worker.entry';
import 'pdfjs-dist/build/pdf.worker';


// Initialize PDF.js worker
// if (typeof window !== 'undefined' && 'Worker' in window) {
//     pdfjsLib.GlobalWorkerOptions.workerPort = new PDFWorker();
// }

pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.mjs';

export default function PDFViewer({ url }) {
    const canvasRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPDF = async () => {
            try {
                setLoading(true);
                setError(null);

                const loadingTask = pdfjsLib.getDocument(url);
                const pdf = await loadingTask.promise;
                const page = await pdf.getPage(1);

                const canvas = canvasRef.current;
                const context = canvas.getContext('2d');

                const viewport = page.getViewport({ scale: 1.5 });
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;

                setLoading(false);
            } catch (error) {
                console.error('Error loading PDF:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        loadPDF().then(r => r);
    }, [url]);

    if (error) {
        return (
            <Paper shadow="sm" p="md" className="bg-red-50">
                <Text color="red">Error loading PDF: {error}</Text>
            </Paper>
        );
    }

    return (
        <Paper shadow="sm" p="md" className="relative min-h-[400px]">
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <Loader size="lg" />
                </div>
            )}
            <canvas
                ref={canvasRef}
                style={{
                    width: '100%',
                    height: 'auto',
                    pointerEvents: 'none',
                    display: loading ? 'none' : 'block'
                }}
                onContextMenu={(e) => e.preventDefault()}
            />
        </Paper>
    );
}
