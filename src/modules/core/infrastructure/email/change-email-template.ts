export function changeEmailTemplate(code: string): string {
    return `
        <!DOCTYPE html>
        <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Request to Change E-mail Address.</title>
            </head>
            <body>
                <div style="max-width: 600px; margin: auto; padding: 20px;">
                    <h1>Peer Drive</h1>

                    <h2>Request to Change E-mail Address.</h2>

                    <p>You Request to Change E-mail Address.</p>

                    <p>Use the code below:</p>

                    <h2>${code}</h2>

                    <p>If you don't request, ignore this mail.</p>
                </div>
            </body>
        </html>
    `;
}