export function forgotPasswordTemplate(code: string): string {
    return `
        <!DOCTYPE html>
        <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Recovery.</title>
            </head>
            <body>
                <div style="max-width: 600px; margin: auto; padding: 20px;">
                    <h1>Peer Drive</h1>

                    <h2>Password Recovery.</h2>

                    <p>You request the recovery of your password.</p>

                    <p>Use the code below:</p>

                    <h2>${code}</h2>

                    <p>If you did not request this change, please ignore this email.</p>
                </div>
            </body>
        </html>
    `;
}