import { Client } from '@microsoft/microsoft-graph-client';
import 'isomorphic-fetch';

const getAccessToken = async () => {
    return "dummy_access_token"; 
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

    const fileName = `ticket-${Date.now()}.json`;
    const fileContent = JSON.stringify(ticketData, null, 2);

    try {
        // --- Логика загрузки в OneDrive будет здесь ---
        // const accessToken = await getAccessToken();
        // const client = Client.init({ authProvider: (done) => done(null, accessToken) });
        // await client.api(`/me/drive/root:/${fileName}:/content`).put(fileContent);

        console.log('--- TICKET CREATED (JSON) ---');
        console.log(fileContent);
        console.log('-----------------------------');

        res.status(200).json({ message: 'Тикет успешно создан и (пока что) выведен в консоль сервера.' });

    } catch (error) {
        console.error('Failed to create ticket:', error);
        res.status(500).json({ msg: 'Ошибка при создании тикета' });
    }
};