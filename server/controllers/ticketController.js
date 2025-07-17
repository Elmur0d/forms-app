import { ConfidentialClientApplication } from '@azure/msal-node';
import { Client } from '@microsoft/microsoft-graph-client';
import 'isomorphic-fetch';

const msalConfig = {
    auth: {
        clientId: process.env.ONEDRIVE_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`,
        clientSecret: process.env.ONEDRIVE_CLIENT_SECRET,
    }
};

const cca = new ConfidentialClientApplication(msalConfig);

const getAccessToken = async () => {
    const tokenRequest = {
        scopes: ['https://graph.microsoft.com/.default'],
    };
    const response = await cca.acquireTokenByClientCredential(tokenRequest);
    return response.accessToken;
};

export const createHelpTicket = async (req, res) => {
    const { summary, priority, pageLink } = req.body;
    const user = req.user;

    const ticketData = {
        reportedBy: user.email,
        template: "N/A", 
        link: pageLink,
        priority: priority,
        summary: summary,
        adminEmails: [process.env.ADMIN_EMAIL]
    };

    const fileName = `ticket-${Date.now()}-${user.id}.json`;
    const fileContent = JSON.stringify(ticketData, null, 2);

    try {
        const accessToken = await getAccessToken();
        const client = Client.init({
            authProvider: (done) => {
                done(null, accessToken);
            },
        });

        const response = await client.api(`/me/drive/root:/HelpTickets/${fileName}:/content`).put(fileContent);

        res.status(201).json({ message: 'Тикет успешно создан и загружен в OneDrive.', url: response.webUrl });

    } catch (error) {
        console.error('Failed to upload to OneDrive:', error.message);
        res.status(500).json({ msg: 'Ошибка при загрузке файла в OneDrive' });
    }
};