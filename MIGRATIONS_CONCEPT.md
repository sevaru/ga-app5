
**Q**: Who knows when to migrate?

**A**: GA runner

---

**Q**: How migration happens?

**A**: _GA instance_ (_GI_) requests for migrants and waits for incoming message with them.
Message format 
```
type Individual = Array<number>; // Genom gen serialization structure;

interface IMigrationRequest {
    data: Individual[];
    size: number;
}

interface IMigrationResponse {
    data: Individual[];
}
```
_GI_ 
1) receives migration rate options
2) on GA iteration checks rate and if needed push and requests migrants 
3) **Host** collect and share migrants requests and _GI_ **IDs** and sends migrants from **pool**
---

# Migration options
1) Migration rate (in eras?)
2) Migration size
