import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const submitForm = async (req, res) => {
  const { templateId, answers } = req.body; 
  const userId = req.user.id;

  try {
    const newForm = await prisma.form.create({
      data: {
        templateId: parseInt(templateId),
        userId: userId,
      },
    });

    const answerData = Object.entries(answers).map(([questionId, value]) => ({
      formId: newForm.id,
      questionId: parseInt(questionId),
      value: String(value), 
    }));

    await prisma.answer.createMany({
      data: answerData,
    });

    res.status(201).json(newForm);
  } catch (error) {
    console.error('Form submission failed:', error);
    res.status(500).json({ msg: 'Ошибка при отправке формы' });
  }
};