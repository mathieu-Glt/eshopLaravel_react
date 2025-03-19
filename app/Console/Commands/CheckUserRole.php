<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class CheckUserRole extends Command
{
    protected $signature = 'user:check-role {email}';
    protected $description = 'Vérifie les rôles d\'un utilisateur';

    public function handle()
    {
        $email = $this->argument('email');
        $user = User::where('email', $email)->first();

        if (!$user) {
            $this->error("Utilisateur avec l'email {$email} non trouvé");
            return;
        }

        $this->info("Utilisateur trouvé : {$user->name}");
        $this->info("Rôles : " . $user->getRoleNames()->join(', '));

        // Vérifier si l'utilisateur a le rôle admin
        if ($user->hasRole('admin')) {
            $this->info("✅ L'utilisateur a le rôle admin");
        } else {
            $this->error("❌ L'utilisateur n'a PAS le rôle admin");
        }

        // Afficher les permissions
        $this->info("Permissions : " . $user->getAllPermissions()->pluck('name')->join(', '));
    }
}