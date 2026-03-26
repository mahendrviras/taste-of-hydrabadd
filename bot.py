def run(state, memory):
    # Parse memory: "tx,ty" (last known target position)
    # Arena is 800x500; default to center
    tx, ty = 400, 250
    if memory:
        try:
            p = memory.split(",")
            tx, ty = int(p[0]), int(p[1])
        except Exception:
            pass

    my_x, my_y = state.my_position()
    my_hp = state.my_health()
    my_fuel = state.my_fuel()
    mag, reserve = state.my_ammo()
    enemies = state.enemy_positions()
    markers = state.player_markers()
    gun_spawns = state.gun_spawns()
    medkits = state.medkit_spawns()
    bullets = state.bullet_positions()

    # --- Bullet Evasion ---
    # Dodge by thrusting perpendicular (upward) when a bullet is on a collision course
    for b in bullets:
        bx, by = b["x"], b["y"]
        bvx, bvy = b["vx"], b["vy"]
        dx = my_x - bx
        dy = my_y - by
        if abs(dx) < 80 and abs(dy) < 60 and my_fuel > 10:
            # Bullet heading toward us horizontally
            if (bvx > 0 and dx > 0) or (bvx < 0 and dx < 0):
                jetpack()
            # Bullet heading toward us from below
            elif bvy < 0 and dy < 0:
                jetpack()

    # --- Ammo Management ---
    # Reload or switch weapons; continue remaining logic so the bot can still move/evade
    if mag == 0:
        if reserve > 0:
            reload()
        else:
            switch_weapon()

    # --- Medkit Priority ---
    if my_hp < 100 and medkits:
        mk = min(medkits, key=lambda m: (m["x"] - my_x) ** 2 + (m["y"] - my_y) ** 2)
        tx, ty = int(mk["x"]), int(mk["y"])

    # --- Pickup Nearby Guns ---
    for gs in gun_spawns:
        if abs(gs["x"] - my_x) < 30 and abs(gs["y"] - my_y) < 30:
            pickup_gun(state)

    # --- Combat: direct enemy contact ---
    if enemies:
        nearest = min(enemies, key=lambda e: (e[0] - my_x) ** 2 + (e[1] - my_y) ** 2)
        ex, ey = nearest
        dx, dy = ex - my_x, ey - my_y
        dist_sq = dx * dx + dy * dy
        tx, ty = int(ex), int(ey)

        # Aim toward enemy (prioritise dominant axis)
        if abs(dx) >= abs(dy):
            aim_right() if dx > 0 else aim_left()
        else:
            aim_down() if dy > 0 else aim_up()

        # Only shoot if we have ammo in the magazine
        if mag > 0:
            shoot()

        # Close gap if far, back off if too close
        if dist_sq > 22500:  # > 150 px
            move_right() if dx > 0 else move_left()
        elif dist_sq < 4900:  # < 70 px
            move_left() if dx > 0 else move_right()

        # Jetpack to gain height advantage or stay mobile
        if dy < -20 and my_fuel > 15:
            jetpack()
        elif my_fuel > 75:
            jetpack()

    # --- Hunt: navigate toward nearest player via marker ---
    # player_markers() has no sensor-radius restriction, so we can always find someone
    elif markers:
        nm = min(markers, key=lambda m: m["distance"])
        angle = nm["angle"]

        # angle convention: 0=right, pi/2=down, -pi/2=up, pi=left
        # cos(angle) > 0 when -pi/2 < angle < pi/2, i.e. target is to the right
        move_right() if -1.57 < angle < 1.57 else move_left()
        aim_right() if -1.57 < angle < 1.57 else aim_left()

        # Jetpack if target is above us (-pi/2 region)
        if angle < -0.52 and my_fuel > 30:
            jetpack()

    # --- Roam: navigate to gun spawn or last known target ---
    else:
        if gun_spawns:
            gs = min(gun_spawns, key=lambda g: (g["x"] - my_x) ** 2 + (g["y"] - my_y) ** 2)
            tx, ty = int(gs["x"]), int(gs["y"])

        if tx > my_x + 10:
            move_right()
        elif tx < my_x - 10:
            move_left()

        if ty < my_y - 30 and my_fuel > 20:
            jetpack()
        elif my_fuel > 80:
            jetpack()

    return f"{tx},{ty}"[:100]
