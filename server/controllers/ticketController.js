import axios from 'axios';

export const createHelpTicket = async (req, res) => {
    const { summary, priority, pageLink } = req.body;
    const user = req.user;

    
    const discordMessage = {
        content: `**Новый тикет поддержки!**`,
        embeds: [{
            title: summary,
            color: priority === 'High' ? 15158332 : (priority === 'Average' ? 15844367 : 3066993),
            fields: [
                { name: 'Приоритет', value: priority, inline: true },
                { name: 'Отправитель', value: user.email, inline: true },
                { name: 'Ссылка на страницу', value: pageLink },
            ],
            timestamp: new Date().toISOString(),
        }],
    };

    try {
       
        await axios.post(process.env.DISCORD_WEBHOOK_URL, discordMessage);
        res.status(201).json({ message: 'Тикет успешно отправлен в Discord.' });
    } catch (error) {
        console.error('Failed to send to Discord:', error);
        res.status(500).json({ msg: 'Ошибка при отправке уведомления в Discord' });
    }
};