export const DEFAULT_CAVEMAN_PROMPT = `You are a conversation compressor. You receive a full transcript of an exchange between a human and an LLM. Your task: produce a condensed version that lets another LLM resume the conversation exactly where it left off, with zero loss of meaning, decisions, or constraints.

## Writing style (caveman)
Telegraphic style. Drop: articles, unnecessary connectors, pleasantries, rephrasing, hedging ("it seems that", "one could argue"). Fragments OK. Keep exact technical terms (function names, API names, libraries, CLI commands, error messages, file paths, variable names) always verbatim — never abbreviated, never reworded.

Levels (pick per instruction, default = full):
- lite: full sentences, just stripped of fluff
- full: fragments, short synonyms, classic caveman
- ultra: one word per fact, conjunctions dropped if meaning stays clear

## What must be preserved 100%
- Facts stated by the human (preferences, constraints, given context)
- Decisions made (what was chosen, not the discarded options)
- Current state of the problem/project at the end of the exchange
- Code, errors, commands, paths, exact names — verbatim in full, never compressed
- Unresolved or pending questions
- Any precise number, date, version, quantity

## What to discard
- Pedagogical explanations already understood/accepted
- Alternatives proposed then rejected
- Pleasantries, transitions, confirmation rephrasing ("okay so to summarize...")
- Intermediate reasoning that didn't change the conclusion

## Output format
CONTEXT: [1-3 lines, what this conversation is about]
FACTS: [bullet list, one fact per line, caveman style]
DECISIONS: [bullet list, what was decided/chosen]
CODE/TECH: [verbatim blocks — code, commands, errors, exact paths — untouched]
STATE: [where things stand right now, caveman style]
OPEN: [unresolved questions, pending next steps]

## Anti-loss rule
If compressing a piece of information would make a decision or constraint ambiguous, keep it in plain, uncompressed language. Clarity on decisions and constraints always wins over compression ratio.

## Do not
- Do not answer or continue the conversation — only compress it
- Do not add opinions, evaluations, or suggestions not present in the original
- Do not summarize code — reproduce it exactly
- Do not merge two distinct decisions into one line`;

export interface SampleConversation {
  id: string;
  title: string;
  category: string;
  transcript: string;
}

export const SAMPLE_CONVERSATIONS: SampleConversation[] = [
  {
    id: "react-express-setup",
    title: "Débogage API React & Express (Long)",
    category: "Développement",
    transcript: `Human: Bonjour, j'essaie de configurer un serveur Express v4.21 avec un frontend React 19 et Vite. Quand je lance npm run dev, le frontend me donne une erreur 404 sur les appels /api/users. Voici mon code server.ts:

import express from 'express';
const app = express();
app.use(express.json());
app.listen(3000, () => console.log('Server running on 3000'));

Et mon Vite config:
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
});

Assistant: Hello! Je vois le problème. Dans ton fichier server.ts, tu n'as pas défini de route /api/users, et dans vite.config.ts, tu n'as pas configuré de proxy pour rediriger les requêtes de Vite vers Express si tu tournes sur deux ports séparés. Cependant, si tu veux utiliser Vite comme middleware Express sur le port 3000, il faut ajouter le middleware createServer de Vite dans ton server.ts.

Voici la solution recommandée:
1. Ajoute les routes API AVANT le middleware Vite.
2. Ajoute createServer de Vite avec middlewareMode: true.

Human: D'accord, parfait! On va choisir l'approche Vite en middlewareMode sur le port 3000. Par contre je veux aussi ajouter SQLite avec Kysely pour sauvegarder les utilisateurs. Est-ce que tu peux m'écrire le schéma de la table users avec id (uuid v4), email (unique), password_hash, et created_at?

Assistant: Très bien! Voici la migration Kysely pour SQLite:

import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('password_hash', 'text', (col) => col.notNull())
    .addColumn('created_at', 'text', (col) => col.defaultTo(sql\`CURRENT_TIMESTAMP\`))
    .execute();
}

Human: Super, c'est exactement ça. Mais pour l'authentification on hésitait entre JWT en cookie HTTP-only et session Express. On a décidé d'utiliser des cookies HTTP-only avec JWT pour rester stateless et éviter la gestion de session sur serveur. Par contre, les mots de passe doivent absolument être hashés avec bcryptjs et une salaison de 12 tours.

Assistant: Compris. Donc décision validée:
- JWT stocké dans un cookie HTTP-only (SameSite=Lax, Secure en prod).
- Mots de passe hashés avec bcryptjs (saltRounds = 12).
- Base SQLite avec Kysely.

Human: Est-ce qu'on a besoin d'installer jsonwebtoken et @types/jsonwebtoken?
Assistant: Oui, npm i jsonwebtoken bcryptjs et npm i -D @types/jsonwebtoken @types/bcryptjs.

Human: Parfait. Maintenant où en est-on sur le projet et qu'est-ce qu'il reste à faire?
Assistant: Le serveur Express avec Vite middleware est en place. La base SQLite et la table users sont définies. Il reste à implémenter les routes POST /api/auth/register et POST /api/auth/login.`,
  },
  {
    id: "architecture-db",
    title: "Choix d'Architecture Base de Données",
    category: "Architecture",
    transcript: `Human: Nous sommes en train de concevoir une application de gestion de stock et de commandes pour une chaîne de 45 magasins de détail. Nous nous demandons si nous devons utiliser PostgreSQL ou MongoDB. Nos besoins principaux: des transactions ACID strictes lors de la réservation de stock, des rapports financiers mensuels automatisés, et la gestion des droits d'accès par rôle (RBAC). Nous prévoyons 50 000 transactions par jour.

Assistant: Pour votre cas d'usage, PostgreSQL est nettement plus adapté que MongoDB. Raisons:
1. Les transactions ACID multi-documents dans les ventes et réservations de stock nécessitent une cohérence forte.
2. Les requêtes de rapports financiers mensuels nécessitent des jointures complexes (JOIN) et des agrégations analytiques optimisées en SQL.
3. PostgreSQL supporte nativement le JSONB si vous avez besoin de flexibilité sur certains attributs produits.

Human: D'accord, on valide PostgreSQL. Pour l'hébergement cloud, on hésite entre AWS RDS PostgreSQL et Supabase. On a une équipe de 3 développeurs fullstack.

Assistant: Si votre équipe est réduite (3 dev) et souhaite avancer vite avec un backend-as-a-service, Supabase offre PostgreSQL géré avec Auth, Row Level Security (RLS) et API auto-générées. AWS RDS demande plus de configuration DevOps.

Human: On choisit Supabase PostgreSQL pour la vitesse de développement et la gestion RLS intégrée. Par contre, la contrainte majeure est que tous les prix doivent être stockés en centimes sous forme d'entiers (INTEGER) pour éviter les erreurs d'arrondi décimal.

Assistant: Noté. Contrainte 100% impérative: montant en centimes (INTEGER). Supabase PostgreSQL retenu.`,
  },
  {
    id: "customer-support-chat",
    title: "Support Client - Réclamation Livraison",
    category: "Support",
    transcript: `Human: Client #8492 (Jean Dupont). Commande CMD-2026-0812 passée le 14 juillet 2026 pour un montant de 189.90€. Colis indiqué comme 'Livré' le 18 juillet par le livreur Chronopost, mais le client affirme ne rien avoir reçu. Le client exige un remboursement immédiat ou un renvoi express.

Assistant: Je vérifie le dossier. Selon la politique commerciale (article 4.2), pour tout colis marqué livré mais contesté:
1. Demander une attestation sur l'honneur de non-réception signée avec copie de pièce d'identité.
2. Ouvrir un litige transporteur auprès de Chronopost (délai de réponse 48h).
3. Si le montant est supérieur à 150€, nous ne pouvons pas effectuer de réexpédition immédiate sans l'attestation signée.

Human: Le client a envoyé l'attestation signée et sa carte d'identité par email à 10h15 ce matin. Le fichier s'appelle attestation_CMD20260812.pdf. On choisit de procéder à la réexpédition express du produit aujourd'hui même via DHL Express (code suivi DHL-99218) plutôt qu'un remboursement.

Assistant: Parfait. Décision enregistrée:
- Attestation reçue et validée.
- Option choisie: Réexpédition DHL Express (suivi DHL-99218).
- Pas de remboursement.
- Dossier de réclamation Chronopost #LIT-8831 ouvert pour indemnisation interne.`,
  }
];
