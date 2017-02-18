# Migration

0) Create inline worker? for browser|node smoothness


1) Стратегия опций
GAOptions = {
    ...,
    migrationSize,
    migrationRate,
    groupCount //determines by weights of evolutions
}
[evolutions]: {
    weights
}

2) GARunner 
- hosts workers
- hosts migrangs

Workers choose GA algorithm by string key 'strategy' in 'start' action

start => ({
    action: 'start',
    data: {
        'strategy': 'darwin' | 'lamark' | ...
    }
})

3) Hash of GAs to start workers!!!!