import React, { useEffect, useRef, useState } from 'react';
import { Paper, Loader, Text } from '@mantine/core';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker';

pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.mjs';

export default function PDFViewer({ url }) {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [numPages, setNumPages] = useState(0);
    const canvasRefs = useRef([]);

    useEffect(() => {
        const loadPDF = async () => {
            try {
                setLoading(true);
                setError(null);

                const loadingTask = pdfjsLib.getDocument(url);
                const pdf = await loadingTask.promise;
                setNumPages(pdf.numPages);

                // Create array of page promises
                const pagePromises = [];
                for (let i = 1; i <= pdf.numPages; i++) {
                    pagePromises.push(pdf.getPage(i));
                }

                // Wait for all pages to load
                const pdfPages = await Promise.all(pagePromises);
                setPages(pdfPages);
                setLoading(false);
            } catch (error) {
                console.error('Error loading PDF:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        loadPDF();
    }, [url]);

    useEffect(() => {
        const renderPages = async () => {
            if (pages.length === 0) return;

            pages.forEach(async (page, index) => {
                const canvas = canvasRefs.current[index];
                if (!canvas) return;

                const context = canvas.getContext('2d');
                const viewport = page.getViewport({ scale: 1.5 });

                canvas.height = viewport.height;
                canvas.width = viewport.width;

                try {
                    await page.render({
                        canvasContext: context,
                        viewport: viewport
                    }).promise;
                } catch (error) {
                    console.error(`Error rendering page ${index + 1}:`, error);
                }
            });
        };

        renderPages();
    }, [pages]);

    if (error) {
        return (
            <Paper shadow="sm" p="md" className="bg-red-50">
                <Text color="red">Error loading PDF: {error}</Text>
            </Paper>
        );
    }

    return (
        <Paper shadow="sm" p="md" className="relative">
            {loading ? (
                <div className="min-h-[400px] flex items-center justify-center">
                    <Loader size="lg" />
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {Array.from({ length: numPages }, (_, i) => (
                        <div key={`page-${i + 1}`} className="relative">
                            <canvas
                                ref={el => canvasRefs.current[i] = el}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    pointerEvents: 'none'
                                }}
                                onContextMenu={(e) => e.preventDefault()}
                            />
                            <div className="absolute bottom-2 right-2 bg-gray-800 text-white px-2 py-1 rounded text-sm">
                                Page {i + 1} of {numPages}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Paper>
    );
}
