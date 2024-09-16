class GitHub {
    constructor() {
        this.client_id = 'YOUR_CLIENT_ID';
        this.client_secret = 'YOUR_CLIENT_SECRET';
    }

    async getUser(user) {
        const profileResponse = await fetch(
            `https://api.github.com/users/${user}?client_id=${this.client_id}&client_secret=${this.client_secret}`
        );

        const repoResponse = await fetch(
            `https://api.github.com/users/${user}/repos?per_page=5&sort=created:asc&client_id=${this.client_id}&client_secret=${this.client_secret}`
        );

        const profile = await profileResponse.json();
        const repos = await repoResponse.json();

        return { profile, repos };
    }
}

class UI {
    constructor() {
        this.profile = document.getElementById('profile');
        this.repos = document.getElementById('repos');
        this.reposTitle = document.getElementById('repos-title');
    }

    showProfile(user) {
        this.profile.innerHTML = `
            <div class="profile-grid">
                <div class="profile-image">
                    <img src="${user.avatar_url}" alt="User Avatar">
                    <a href="${user.html_url}" target="_blank" class="btn">View Profile</a>
                </div>
                <div class="profile-details">
                    <span class="badge badge-primary">Public Repos: ${user.public_repos}</span>
                    <span class="badge badge-secondary">Public Gists: ${user.public_gists}</span>
                    <span class="badge badge-success">Followers: ${user.followers}</span>
                    <span class="badge badge-info">Following: ${user.following}</span>
                    <ul class="list-group">
                        <li class="list-group-item">Company: ${user.company || 'N/A'}</li>
                        <li class="list-group-item">Website/Blog: ${user.blog || 'N/A'}</li>
                        <li class="list-group-item">Location: ${user.location || 'N/A'}</li>
                        <li class="list-group-item">Member Since: ${new Date(user.created_at).toLocaleDateString()}</li>
                    </ul>
                </div>
            </div>
        `;
    }

    showRepos(repos) {
        this.reposTitle.style.display = 'block';
        let output = '';
        repos.forEach(repo => {
            output += `
                <div class="repo">
                    <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
                    <div class="repo-stats">
                        <span class="badge badge-primary">Stars: ${repo.stargazers_count}</span>
                        <span class="badge badge-secondary">Watchers: ${repo.watchers_count}</span>
                        <span class="badge badge-success">Forks: ${repo.forks_count}</span>
                    </div>
                </div>
            `;
        });
        this.repos.innerHTML = output;
    }

    clearProfile() {
        this.profile.innerHTML = '';
        this.repos.innerHTML = '';
        this.reposTitle.style.display = 'none';
    }
}

const github = new GitHub();
const ui = new UI();

const searchUser = document.getElementById('searchUser');

searchUser.addEventListener('keyup', (e) => {
    const userText = e.target.value;

    if (userText !== '') {
        github.getUser(userText).then(data => {
            if (data.profile.message === 'Not Found') {
            } else {
                ui.showProfile(data.profile);
                ui.showRepos(data.repos);
            }
        });
    } else {
        ui.clearProfile();
    }
});