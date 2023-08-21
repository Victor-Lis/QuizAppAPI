import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import bodyParser from 'body-parser';
import express from "express";
import cors from 'cors';
const app = express();
app.use(cors());
app.use(bodyParser.json())

app.get('/users', async (req: any, res: { send: (arg0: { id: number; name: string; email: string; password: string; pontuacao: number; }[]) => void; }) => {

  const users = await prisma.user.findMany()

  res.send(users)

})

app.post('/signin', async (req: { body: { email: any; password: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; user?: { id: number; name: string; email: string; password: string; pontuacao: number; }; }): void; new(): any; }; }; }) => {
  
  const { email, password}  = req.body;
  console.log("SIGN IN")

  try {

    console.log(`Email: ${email} | Senha: ${password}`);

    const user = await prisma.user.findUnique({
      where: {
        email,
        password,
      },
    })

    if (user) {
      // Autenticação bem-sucedida
      res.status(200).json({ message: 'Autenticação bem-sucedida', user: user });
    } else {
      // Autenticação falhou
      res.status(401).json({ message: 'Credenciais inválidas' });
    }
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

app.post('/signup', async (req: { body: { name: any; email: any; password: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { message: string; user?: { id: number; name: string; email: string; password: string; pontuacao: number; }; }): void; new(): any; }; }; }) => {

  const { name, email, password }  = req.body;
  console.log("SIGN UP")

  try {

    console.log(`Nome: ${name} | Email: ${email} | Senha: ${password}`);

    const user = await prisma.user.create({

      data: {

        name,
        email,
        password,
        pontuacao: 0,

      }

    }).catch(err => {

      if(err.meta.target[0] == "email"){

        res.status(401).json({ message: 'Email em uso!' });
        return

      }

    })

    if (user) {
      // Autenticação bem-sucedida
      res.status(200).json({ message: 'Autenticação bem-sucedida', user: user });
    } else {
      // Autenticação falhou
      res.status(401).json({ message: 'Credenciais inválidas! Email pode estar em uso!' });
    }
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

app.get(`/quests`, async (req: any, res: { send: (arg0: { group: number; quest: string; answer1: string; answer2: string; answer3: string; answer4: string; correctAnswer: number; }[]) => void; }) => {

  const quests = await prisma.quests.findMany({})

  res.send(quests)

})

const PORT = process.env.PORT || 3333

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
