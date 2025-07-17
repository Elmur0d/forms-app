import axios from 'axios';

export const createHelpTicket = async (req, res) => {
    const { summary, priority, pageLink } = req.body;
    const user = req.user;

    const ticketData = {
        reportedBy: user.email,
        link: pageLink,
        priority: priority,
        summary: summary,
        adminEmails: [process.env.ADMIN_EMAIL]
    };

    const fileName = `ticket-${Date.now()}.json`;
    const fileContent = JSON.stringify(ticketData, null, 2);

    try {
        const dropboxApiArgs = {
            path: `/HelpTickets/${fileName}`, 
            mode: 'add',
            autorename: true,
            mute: false
        };

        await axios.post('https://content.dropboxapi.com/2/files/upload', fileContent, {
            headers: {
                'Authorization': `Bearer ${process.env.DROPBOX_ACCESS_TOKEN}`,
                'Dropbox-API-Arg': JSON.stringify(dropboxApiArgs),
                'Content-Type': 'application/octet-stream',
            },
        });

        res.status(201).json({ message: 'Тикет успешно создан и загружен в Dropbox.' });

    } catch (error) {
        console.error('Failed to upload to Dropbox:', error.response ? error.response.data : error.message);
        res.status(500).json({ msg: 'Ошибка при загрузке файла в Dropbox' });
    }
};