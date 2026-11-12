document.addEventListener('DOMContentLoaded', function() {
    const foundingMembers = [
        { name: 'kenai', discordId: '1193930694171316326', profileUrl: 'https://wckd.lol/kenai'},
        { name: 'alfie', discordId: '1522885078580072588', profileUrl: 'https://wckd.lol/alfie'},
        { name: 'kurt', discordId: '484191284936966162', profileUrl: 'https://wckd.lol/kurt'},
        { name: 'koba', discordId: '1365623461749456976', profileUrl: 'https://wckd.lol/koba'},
        { name: 'kira', discordId: '1369931671163506788', profileUrl: 'https://wckd.lol/kira'},
        { name: 'nart', discordId: '1007554371820716042', profileUrl: 'https://wckd.lol/nart'},
        { name: 'bogs', discordId: '835961275136606288', profileUrl: 'https://wckd.lol/bogs'},
        { name: 'julsx', discordId: '1081632206046376107', profileUrl: 'https://wckd.lol/julsx'},
        { name: 'syy', discordId: '417939976223719435', profileUrl: 'https://wckd.lol/syy'},
        { name: 'mingo', discordId: '663764510506614794', profileUrl: 'https://wckd.lol/mingo'},
        { name: 'karl', discordId: '936266952836534342', profileUrl: 'https://wckd.lol/karl'},
        { name: 'lorenz', discordId: '1094616000386846855', profileUrl: 'https://wckd.lol/lorenz'},
        { name: 'jet', discordId: '744149902744879155', profileUrl: 'https://wckd.lol/jet'},
        { name: 'miro', discordId: '713451103760679072', profileUrl: 'https://wckd.lol/miro'},
        { name: 'aedro', discordId: '523408189237100546', profileUrl: 'https://wckd.lol/aedro'},
        { name: 'reezu', discordId: '646143372628721686', profileUrl: 'https://wckd.lol/reezu'},
        { name: 'maze', discordId: '749625489458462810', profileUrl: 'https://wckd.lol/maze'},
        { name: 'chin', discordId: '509040989210542091', profileUrl: 'https://wckd.lol/chin'},
    ];

    function loadFoundingMember(b) {
        fetch(`https://api.lanyard.rest/v1/users/${b.discordId}`)
            .then(r => r.json())
            .then(d => {
                if (!d.success) return;
                
                const i = `activity-${b.name}`;
                const e = document.getElementById(i);
                const u = d.data;
                if (window.updateFoundingOnlineCount) window.updateFoundingOnlineCount(u.discord_status);
                const a = u.discord_user.avatar 
                    ? `https://cdn.discordapp.com/avatars/${b.discordId}/${u.discord_user.avatar}.png?size=512`
                    : `https://cdn.discordapp.com/embed/avatars/0.png`;
                
                const decorData = u.discord_user.avatar_decoration_data;
                const decorUrl = decorData?.asset 
                    ? `https://cdn.discordapp.com/avatar-decoration-presets/${decorData.asset}.png?size=512&passthrough=true` 
                    : null;

                const c = document.querySelector(`.wckd-member[data-userid="${b.discordId}"] .avatar-container`);
                if (c) {
                    let g = c.querySelector('.avatar');
                    if (!g) {                        
                        g = document.createElement('img');
                        g.className = 'avatar';
                        g.alt = u.discord_user.username;
                        c.prepend(g);
                    }
                    g.src = a;

                    let mainDecor = c.querySelector('.avatar-decoration');
                    if (decorUrl) {
                        if (!mainDecor) {
                            mainDecor = document.createElement('img');
                            mainDecor.className = 'avatar-decoration';
                            mainDecor.alt = 'Avatar Decoration';
                            c.appendChild(mainDecor);
                        }
                        mainDecor.src = decorUrl;
                    } else if (mainDecor) {
                        mainDecor.remove();
                    }
                }
                
                let h = `
                <div class="discord-profile">
                    <div class="profile-header">
                        <div class="avatar-wrapper">
                            <img class="profile-avatar" src="${a}" alt="Discord Avatar">
                            ${decorUrl ? `<img class="avatar-decoration" src="${decorUrl}" alt="Avatar Decoration">` : ''}
                        </div>
                        <div class="profile-info">
                            <div class="profile-username">${u.discord_user.username}</div>
                            <div class="profile-status ${u.discord_status}">
                                <span class="status-indicator"></span>
                                ${u.discord_status}
                            </div>
                        </div>
                    </div>`;
                
                if (u.spotify) {
                    const s = u.spotify;
                    let p = 0;
                    if (s.timestamps) {
                        const t = s.timestamps.start;
                        const n = s.timestamps.end;
                        const l = Date.now() - t;
                        p = Math.min(100, Math.max(0, (l / (n - t)) * 100));
                    }
                    
                    h += `
                        <div class="spotify-activity">
                            <div class="spotify-header">
                                <i class='bx bxl-spotify spotify-icon'></i>
                                <span>Listening to Spotify</span>
                            </div>
                            <div class="spotify-content">
                                <img class="album-art" src="${s.album_art_url}" alt="Album Art">
                                <div class="spotify-info">
                                    <div class="song-title">${s.song}</div>
                                    <div class="song-artist">by ${s.artist}</div>
                                    <div class="song-album">on ${s.album}</div>
                                </div>
                            </div>
                            <div class="spotify-progress">
                                <div class="spotify-progress-bar" style="width: ${p}%"></div>
                            </div>
                        </div>`;
                }
                
                if (u.discord_status !== "offline" && u.activities) {
                    const o = u.activities.find(v => v.type === 4);
                    if (o && o.state) {
                        let j = '';
                        if (o.emoji) {
                            if (o.emoji.id) {
                                const z = o.emoji.animated ? 'gif' : 'png';
                                j = `<img class="status-emoji-img" src="https://cdn.discordapp.com/emojis/${o.emoji.id}.${z}" alt="${o.emoji.name}">`;
                            } else {
                                j = `<span class="status-emoji">${o.emoji.name}</span>`;
                            }
                        }
                        
                        h += `
                            <div class="custom-status">
                                ${j}
                                <span class="status-text">${o.state}</span>
                            </div>`;
                    }
                }
                
                if (u.activities && u.activities.length > 0) {
                    const q = u.activities.filter(v => 
                        (v.type === 0 || v.type === 1 || v.type === 3) || 
                        (v.type === 2 && v.name !== 'Spotify')
                    );
                    
                    if (q.length > 0) {
                        h += '<div class="profile-activities">';
                        q.forEach(v => {
                            const y = ["Playing", "Streaming", "Listening to", "Watching", ""];
                            const k = y[v.type] || "";
                            
                            h += `<div class="activity-item">`;
                            if (v.assets && v.assets.large_image) {
                                let x = v.assets.large_image;
                                if (x.startsWith('mp:')) x = `https://media.discordapp.net/${x.replace('mp:', '')}`;
                                else if (v.application_id) x = `https://cdn.discordapp.com/app-assets/${v.application_id}/${x}.png`;
                                h += `<img class="activity-icon" src="${x}" onerror="this.style.display='none'">`;
                            }
                            
                            h += `<div class="activity-details"><div class="activity-name">${k} ${v.name}</div>`;
                            if (v.details) h += `<div class="activity-detail">${v.details}</div>`;
                            if (v.state) h += `<div class="activity-state">${v.state}</div>`;
                            if (v.timestamps && v.timestamps.start) {
                                const w = Math.floor((Date.now() - v.timestamps.start) / (1000 * 60));
                                const t = w >= 60 ? `${Math.floor(w / 60)}h ${w % 60}m` : `${w}m`;
                                h += `<div class="activity-time">Elapsed: ${t}</div>`;
                            }
                            h += `</div></div>`;
                        });
                        h += '</div>';
                    }
                } else if (u.discord_status !== "offline") {
                    h += '<div class="no-activity">No current activity</div>';
                }
                
                h += '</div>';
                if (e) {
                    e.innerHTML = h;
                }
            })
            .catch(error => console.error('Error fetching Discord profile:', error));
    }

    const foundingRoster = document.getElementById('founding-roster');
    const onlineCount = document.getElementById('online-count');
    let onlineFounders = 0;

    function renderFoundingMember(b, index) {
        if (!foundingRoster) return;
        const member = document.createElement('article');
        member.className = 'wckd-member';
        member.dataset.userid = b.discordId;
        member.innerHTML = `
            <div class="member-index">${String(index + 1).padStart(2, '0')}</div>
            <div class="avatar-container" role="link" tabindex="0" aria-label="Open ${b.name}'s WCKD webcard">
                <div class="discord-activity"><div class="activity-content" id="activity-${b.name}"></div></div>
            </div>
            <div class="member-fallback-name">${b.name}</div>`;
        foundingRoster.appendChild(member);
        const avatarContainer = member.querySelector('.avatar-container');
        avatarContainer.onclick = function(event) {
            event.stopPropagation();
            window.location.href = memberProfilePages.has(b.name.toLowerCase())
                ? b.profileUrl
                : `https://discord.com/users/${b.discordId}`;
        };
        avatarContainer.onkeydown = function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                avatarContainer.click();
            }
        };
        loadFoundingMember(b);
    }

    if (foundingRoster) foundingMembers.forEach(renderFoundingMember);

    window.updateFoundingOnlineCount = (status) => {
        onlineFounders += status !== 'offline' ? 1 : 0;
        if (onlineCount) onlineCount.textContent = String(onlineFounders).padStart(2, '0');
    };

    window.refreshFoundingMembers = () => {
        onlineFounders = 0;
        if (onlineCount) onlineCount.textContent = '--';
        foundingMembers.forEach(loadFoundingMember);
    };
});

const memberProfilePages = new Set([
    'aedro', 'ady', 'alfie', 'alaz', 'bogs', 'bullet', 'chin', 'chxos',
    'cristan', 'cyan', 'desiree', 'ezekiel', 'gxbzuu', 'inx', 'ish', 'jet',
    'jeyeel', 'julsx', 'karl', 'kenai', 'keyos', 'kira', 'koba', 'kurt',
    'loisha', 'lorenz', 'luis', 'matcha', 'maze', 'mingo', 'miro', 'murador',
    'nart', 'omskrtt', 'rai', 'rayzet', 'reezu', 'sabon', 'seyahtzy', 'syy',
    'tinn', 'woozie', 'yuan', 'yuki', 'zy',
]);

const d = {
    "416610185709092884": "Matcha","1273126257516740634": "Ady","838084955682504734": "Rayzet", "1523011988555436184": "Sabon",
    "1015455412889333821": "Omskrtt","374096579625484288": "Murador", "829644788231307286" : "Desiree",
     "1395211546069565470": "Woozie","766278418617991188": "Yuki",  "1465274016846581761": "Keyos",
     "737520867394715678": "Rai", "750334684508192830": "Luis", "798199481958006784": "Yuan", "1433014343406063699": "Bullet"
    
};
        
const r = {
    "1260066000238542944": "Inx","701369290930257930": "Alaz", "1371961689960091693": "Loisha",
    "1258275196108800034": "Zy", "396809095006650369": "Jeyeel","645893585132322826": "Ezekiel",
    "1216214533178261595": "Seyahtzy", "1225069253171089471": "Ish", "1253349609409871905": "Cristan", 
    "1404192605855813713": "Chxos", "606133079085547520": "Cyan", "973249074713210910" : "Gxbzuu", "724085289768714311" : "Tinn",
};

const GG = t => ['Playing', 'Streaming', 'Listening to', 'Watching', 'Custom Status:', 'Competing in'][t] || 'Playing';

const createPresencePopup = (data) => {
    const popup = document.createElement('div');
    popup.className = 'presence-popup';

    if (!data) {
        const details = document.createElement('div');
        details.className = 'activity-details';
        details.textContent = 'Could not load status';
        popup.appendChild(details);
        return popup;
    }

    const { spotify, activities } = data;

    if (spotify) {
        const details = document.createElement('div');
        details.className = 'activity-details';

        const type = document.createElement('div');
        type.className = 'activity-type';
        const icon = document.createElement('i');
        icon.className = 'fab fa-spotify';
        type.append(icon, document.createTextNode(' Listening to Spotify'));

        const name = document.createElement('div');
        name.className = 'activity-name';
        name.textContent = spotify.song;

        const info = document.createElement('div');
        info.className = 'activity-info';
        info.textContent = `by ${spotify.artist}`;

        details.append(type, name, info);
        popup.appendChild(details);
    } else if (activities?.length > 0) {
        const customStatus = activities.find(a => a.type === 4);
        const otherActivities = activities.filter(a => a.type !== 4 && a.name !== 'Spotify');

        if (customStatus) {
            const details = document.createElement('div');
            details.className = 'activity-details';
            const type = document.createElement('div');
            type.className = 'activity-type';

            if (customStatus.emoji?.id) {
                const img = document.createElement('img');
                img.src = `https://cdn.discordapp.com/emojis/${customStatus.emoji.id}${customStatus.emoji.animated ? '.gif' : '.png'}`;
                img.alt = 'emoji';
                img.style.width = '20px';
                img.style.height = '20px';
                type.appendChild(img);
            }

            if (customStatus.state) type.appendChild(document.createTextNode(` ${customStatus.state}`));
            details.appendChild(type);
            popup.appendChild(details);
        }

        otherActivities.forEach(activity => {
            const details = document.createElement('div');
            details.className = 'activity-details';

            const type = document.createElement('div');
            type.className = 'activity-type';
            type.textContent = `${GG(activity.type)} ${activity.name}`;
            details.appendChild(type);

            if (activity.details) {
                const info = document.createElement('div');
                info.className = 'activity-info';
                info.textContent = activity.details;
                details.appendChild(info);
            }

            if (activity.state) {
                const state = document.createElement('div');
                state.className = 'activity-state';
                state.textContent = activity.state;
                details.appendChild(state);
            }

            if (activity.timestamps?.start) {
                const time = document.createElement('div');
                time.className = 'activity-time';
                const elapsed = Math.floor((Date.now() - activity.timestamps.start) / 60000);
                time.textContent = `Elapsed: ${elapsed} minutes`;
                details.appendChild(time);
            }

            popup.appendChild(details);
        });
    }

    return popup;
};

const createUserElement = (userId, result, m) => {
    const data = result?.success ? result.data : null;
    const discord_user = data?.discord_user;
    const discord_status = data?.discord_status || 'offline';
    const userName = m[userId];

    const profileUrl = userName && memberProfilePages.has(userName.toLowerCase())
        ? `https://wckd.lol/${encodeURIComponent(userName.toLowerCase())}`
        : (discord_user ? `https://discord.com/users/${discord_user.id}` : '#');

    let avatarUrl = 'https://cdn.discordapp.com/embed/avatars/0.png';
    if (discord_user?.avatar) {
        avatarUrl = `https://cdn.discordapp.com/avatars/${discord_user.id}/${discord_user.avatar}.png?size=512`;
    } else if (discord_user?.discriminator) {
        const defaultAvatarId = parseInt(discord_user.discriminator) % 5;
        avatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarId}.png`;
    }

    const displayName = discord_user?.username || userName || `User ID: ${userId}`;

    const btn = document.createElement('a');
    btn.href = profileUrl;
    btn.className = 'trail-btn';
    btn.target = '_blank';

    const avatarWrapper = document.createElement('div');
    avatarWrapper.className = 'avatar-wrapper';

    const img = document.createElement('img');
    img.src = avatarUrl;
    img.alt = `${displayName}'s Avatar`;
    avatarWrapper.appendChild(img);

    if (discord_user?.avatar_decoration_data?.asset) {
        const decorImg = document.createElement('img');
        decorImg.className = 'avatar-decoration';
        decorImg.src = `https://cdn.discordapp.com/avatar-decoration-presets/${discord_user.avatar_decoration_data.asset}.png?size=512&passthrough=true`;
        decorImg.alt = 'Avatar Decoration';
        avatarWrapper.appendChild(decorImg);
    }

    const statusSpan = document.createElement('span');
    statusSpan.className = `status ${discord_status}`;

    const presencePopup = createPresencePopup(data);

    btn.append(avatarWrapper, document.createTextNode(` ${displayName} `), statusSpan, presencePopup);
    return btn;
};

const UU = (i, m, s) => {
    Promise.all(i.map(userId =>
        fetch(`https://api.lanyard.rest/v1/users/${userId}`)
            .then(response => response.ok ? response.json() : ({ success: false, error: `Status: ${response.status}` }))
            .catch(error => ({ success: false, error: error.message, userId: userId }))
    ))
    .then(results => {
        const resultsMap = new Map(results.map(result => [result?.data?.discord_user?.id || result?.userId, result]));
        const container = document.querySelector(s);

        if (container) {
            container.replaceChildren();
            i.forEach(userId => {
                const result = resultsMap.get(userId);
                container.appendChild(createUserElement(userId, result, m));
            });
        }
    });
};

const loadRosterRails = () => {
    UU(Object.keys(d), d, '.button-trail-left');
    UU(Object.keys(r), r, '.button-trail-right');
};

let lightningCanvas, lightningCtx, currentFadeInterval;

function initLightningCanvas() {
    lightningCanvas = document.getElementById('lightning-canvas');
    if (!lightningCanvas) {
        lightningCanvas = document.createElement('canvas');
        lightningCanvas.id = 'lightning-canvas';
        document.body.appendChild(lightningCanvas);
    }
    lightningCtx = lightningCanvas.getContext('2d');
    
    const resize = () => {
        lightningCanvas.width = window.innerWidth;
        lightningCanvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
}

function drawLightningBolt() {
    if (!lightningCanvas || !lightningCtx) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    clearInterval(currentFadeInterval);
    lightningCtx.clearRect(0, 0, lightningCanvas.width, lightningCanvas.height);
    lightningCanvas.style.opacity = '1';

    const startX = Math.random() * lightningCanvas.width;
    const startY = 0;
    const endX = startX + (Math.random() - 0.5) * 500;
    const endY = lightningCanvas.height * (0.5 + Math.random() * 0.5);

    function createSegments(x1, y1, x2, y2, displacement) {
        if (displacement < 10) return [{ x: x1, y: y1 }, { x: x2, y: y2 }];
        
        const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * displacement;
        const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * displacement;
        
        return [
            ...createSegments(x1, y1, midX, midY, displacement / 2),
            ...createSegments(midX, midY, x2, y2, displacement / 2)
        ];
    }

    const path = createSegments(startX, startY, endX, endY, 120);

    lightningCtx.strokeStyle = '#ffffff';
    lightningCtx.shadowColor = '#00d2ff';
    lightningCtx.shadowBlur = 25;
    lightningCtx.lineWidth = 3;

    lightningCtx.beginPath();
    lightningCtx.moveTo(path[0].x, path[0].y);

    for (let i = 1; i < path.length; i++) {
        lightningCtx.lineTo(path[i].x, path[i].y);

        if (Math.random() < 0.12 && i < path.length - 4) {
            const bx = path[i].x + (Math.random() - 0.5) * 180;
            const by = path[i].y + Math.random() * 180;
            const branchPath = createSegments(path[i].x, path[i].y, bx, by, 50);

            lightningCtx.moveTo(branchPath[0].x, branchPath[0].y);
            for (let j = 1; j < branchPath.length; j++) {
                lightningCtx.lineTo(branchPath[j].x, branchPath[j].y);
            }
            lightningCtx.moveTo(path[i].x, path[i].y);
        }
    }
    lightningCtx.stroke();

    let alpha = 1.0;
    currentFadeInterval = setInterval(() => {
        alpha -= 0.08;
        if (alpha <= 0) {
            clearInterval(currentFadeInterval);
            lightningCtx.clearRect(0, 0, lightningCanvas.width, lightningCanvas.height);
            lightningCanvas.style.opacity = '1';
        } else {
            lightningCanvas.style.opacity = alpha.toString();
        }
    }, 35);
}

let audioCtx, analyser, dataArray, isAudioSetup = false;

function setupBeatDetector(audioElement) {
    if (isAudioSetup) return;
    try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioCtx.createMediaElementSource(audioElement);
        analyser = audioCtx.createAnalyser();

        analyser.fftSize = 128;
        dataArray = new Uint8Array(analyser.frequencyBinCount);

        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        isAudioSetup = true;

        let lastBeatTime = 0;
        const beatCooldown = 600; 
        const bassThreshold = 215; 

        function detectBeat() {
            requestAnimationFrame(detectBeat);
            if (audioElement.paused || !analyser) return;

            analyser.getByteFrequencyData(dataArray);
            let bassEnergy = (dataArray[0] + dataArray[1] + dataArray[2] + dataArray[3]) / 4;

            const now = Date.now();
            if (bassEnergy > bassThreshold && (now - lastBeatTime) > beatCooldown) {
                lastBeatTime = now;
                drawLightningBolt();
            }
        }

        detectBeat();
    } catch (err) {
        console.warn("AudioContext setup notice:", err);
    }
}

const EE = () => {
    const b = document.getElementById('background-music');
    const t = document.getElementById('music-toggle');

    initLightningCanvas();

    if (b) {
        b.volume = b.volume || 0.5;
        b.crossOrigin = "anonymous";

        b.addEventListener('play', () => {
            if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
            setupBeatDetector(b);
        });
    }

    const updateToggleIcon = (isPlaying) => {
        if (!t) return;
        t.replaceChildren();
        const icon = document.createElement('i');
        icon.className = isPlaying ? 'bx bx-music' : 'bx bx-music-off';
        t.appendChild(icon);
        t.setAttribute('aria-label', isPlaying ? 'Mute ambient sound' : 'Unmute ambient sound');
        t.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
    };

    if (t && b) {
        updateToggleIcon(!b.paused);
        b.addEventListener('play', () => updateToggleIcon(true));
        b.addEventListener('pause', () => updateToggleIcon(false));

        t.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            const mainPlayPause = document.getElementById('play-pause');
            if (mainPlayPause) mainPlayPause.click();
        });
    }
};

const createDiscordWidget = (code, x) => {
    const widget = document.createElement('div');
    widget.className = 'discord-widget';

    const banner = document.createElement('div');
    banner.className = 'discord-banner';
    if (x?.guild?.banner) {
        banner.style.backgroundImage = `url('https://media.discordapp.net/attachments/1379846639069691965/1534761828947595344/wckd.gif?ex=6a98e656&is=6a9794d6&hm=ea1a2c9ac7541602ef30ccebe0b84613b7649d44e62dbc29748ab49bb847aab3&=')`;
    }

    const icon = document.createElement('img');
    icon.className = 'server-icon';

    const serverName = document.createElement('div');
    serverName.className = 'server-name';

    const members = document.createElement('div');
    members.className = 'online-members';

    const joinBtn = document.createElement('a');
    joinBtn.className = 'join-server-btn';
    joinBtn.href = `https://discord.gg/${x?.code || code}`;
    joinBtn.target = '_blank';
    joinBtn.textContent = 'Join Server';

    if (x && x.guild) {
        icon.src = `https://cdn.discordapp.com/icons/${x.guild.id}/${x.guild.icon}.png`;
        icon.alt = `${x.guild.name}'s icon`;
        serverName.textContent = x.guild.name;
        members.textContent = `${x.approximate_presence_count || '-'} / ${x.approximate_member_count || '-'} Members Online`;
    } else {
        icon.src = 'https://discord.com/assets/f8389ac1a40319420746f762999e2a79.png';
        icon.alt = 'Placeholder icon';
        serverName.textContent = `Invite: ${code}`;
        members.textContent = x?.error || 'Could not load server data.';
    }

    widget.append(banner, icon, serverName, members, joinBtn);
    return widget;
};

const WW = () => {
    const j = ["BKDtAAvqcd", "V6ekgzK4zr"];

    Promise.all(j.map(c =>
        fetch(`https://discord.com/api/v9/invites/${c}?with_counts=true&with_expiration=true`)
            .then(res => res.ok ? res.json() : ({ code: c, error: `Status: ${res.status}` }))
            .catch(err => ({ code: c, error: err.message }))
    )).then(k => {
        const v = document.querySelector(".discord-widgets-container") || (() => {
            const c = document.createElement("div");
            c.className = "discord-widgets-container";
            const mainContainer = document.querySelector('.main-container');
            if (mainContainer) mainContainer.after(c);
            else document.body.appendChild(c);
            return c;
        })();

        v.replaceChildren();

        const resultsMap = new Map(k.map(result => [result?.code, result]));
        j.forEach(code => {
            const x = resultsMap.get(code);
            v.appendChild(createDiscordWidget(code, x));
        });
    });
};

document.addEventListener('DOMContentLoaded', () => {
    EE();
    if (window.refreshFoundingMembers) setInterval(window.refreshFoundingMembers, 30000);
    loadRosterRails();
    setInterval(loadRosterRails, 30000);
    WW();
});

document.addEventListener('DOMContentLoaded', () => {
    const crosshair = document.getElementById('custom-crosshair');
    const supportsFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!supportsFinePointer || prefersReducedMotion) {
        if (crosshair) crosshair.style.display = 'none';
        document.body.classList.add('no-custom-cursor');
        return;
    }

    document.body.classList.add('has-custom-cursor');

    let lastX = 0;
    let lastY = 0;

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        if (crosshair) {
            crosshair.style.left = `${x}px`;
            crosshair.style.top = `${y}px`;
        }

        const distance = Math.hypot(x - lastX, y - lastY);
        if (distance > 8) {
            createSnowFlake(x, y);
            lastX = x;
            lastY = y;
        }
    });

    function createSnowFlake(x, y) {
        const flake = document.createElement('div');
        flake.className = 'cursor-trail';
        flake.textContent = '๋࣭ ⭑';
        flake.style.left = `${x}px`;
        flake.style.top = `${y}px`;

        const size = Math.floor(Math.random() * 8) + 10;
        flake.style.fontSize = `${size}px`;

        const driftX = (Math.random() - 0.5) * 60;
        flake.style.setProperty('--drift-x', `${driftX}px`);

        document.body.appendChild(flake);

        setTimeout(() => {
            flake.remove();
        }, 2000);
    }
});