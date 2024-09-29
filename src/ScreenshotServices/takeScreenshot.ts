import tesseract from 'node-tesseract-ocr';
import screenshot from "screenshot-desktop"
import fs from 'fs';
import sharp from 'sharp';
import axios from 'axios';

// Função para calcular as coordenadas ajustadas
const getAdjustedCropCoordinates = (width: number, height: number, cropWidth: number, cropHeight: number) => {
    // Calculando as coordenadas como no Python
    const baseLeft = (width - cropWidth) / 2;
    const baseTop = (height - cropHeight) / 2;

    const left = baseLeft + (0.12 * baseLeft);
    const top = baseTop + (0.30 * baseTop);
    const right = left + cropWidth + (0.01 * (left + cropWidth));

    const decreaseBottom = height * (10 / 100);
    const bottom = top + cropHeight + (0.10 * (top + cropHeight)) - decreaseBottom;

    return { left, top, right, bottom };
};

// Função para salvar a imagem se a captura for válida
const saveImage = (img: any, imagePath: string) => {
    if (img && img.length > 0) {
        fs.writeFileSync(imagePath, img);
        return true;
    }
    return false;
};

function findNumbersInText(text: string): number[] {
    // Expressão regular para localizar todos os números
    const regex = /\d+(\.\d+)?(?=\D|$)/g;
    // O método match() retorna uma array com todas as correspondências
    const matches = text.match(regex);

    // Converte as correspondências em números e retorna o array
    return matches ? matches.map(Number) : [];
}

export async function extractTextFromImage(): Promise<any> {
    const cropWidth = 600;
    const cropHeight = 300;

    screenshot().then((img) => {
        const imagePath = 'screenshot1.png';

        // Verifica se a imagem capturada é válida antes de salvá-la
        if (saveImage(img, imagePath)) {

            // Processa a imagem se ela foi capturada corretamente
            sharp(imagePath)
                .metadata()
                .then(({ width, height }) => {
                    const { left, top, right, bottom } = getAdjustedCropCoordinates(Number(width), Number(height), cropWidth, cropHeight);
                    return sharp(imagePath)
                        .extract({
                            left: Math.round(left),
                            top: Math.round(top),
                            width: Math.round(right - left),
                            height: Math.round(bottom - top)
                        })
                        .greyscale()
                        .sharpen()
                        .normalise()
                        // .linear(1.5, -50)
                        .modulate({
                            brightness: 1.2,
                        })
                        .toFile('screenshot.png');
                })
                .then(() => {
                    const config = {
                        lang: "por", // Configura para português
                        oem: 1,      // Engine OCR LSTM
                        psm: 6       // Modo de segmentação de página
                    };

                    tesseract.recognize('screenshot.png', config)
                        .then(async (text: string) => {
                            if (text.includes("VOOU PARA LONGE!")) {
                                let url = 'http://127.0.0.1:8000/aviator_boot/screenshot/';

                                const result = findNumbersInText(text)
                                const concatedNumbersInString = result.join('')

                                // if (concatedNumbersInString.includes('.')) {

                                //     // Divide a string no ponto decimal e retorna o comprimento da parte decimal
                                //     const integerPartOfTheNumber = Math.trunc(Number(concatedNumbersInString));

                                //     const floatPartOfTheNumber = concatedNumbersInString.split('.')[1];

                                //     const data = {
                                //         valor: Number(`${integerPartOfTheNumber}.${floatPartOfTheNumber}`)
                                //     }

                                //     try {
                                //         const response = await axios.post(url, data, {
                                //             headers: {
                                //                 'Content-Type': 'application/json'
                                //             }
                                //         });

                                //         console.log("Resposta da API", response.data)

                                //     } catch (error) {
                                //         console.error('Erro ao enviar dados para a api ', error)
                                //     }

                                // }  else {
                                //     console.log("nao tem ponto flutuante", concatedNumbersInString)
                                // }

                                // const data = {
                                //     valor: findNumbersInText(text)
                                // }
                            }
                        })
                        .catch((err: Error) => {
                            console.error("Erro ao extrair texto:", err);
                        });
                })
                .catch((err) => {
                    console.error('Erro ao processar a imagem:', err);
                });
        } else {
            console.error('A captura de tela falhou ou a imagem está corrompida.');
        }
    }).catch((err) => {
        console.error('Erro ao capturar a screenshot:', err);
    });
}
