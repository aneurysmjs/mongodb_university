/**
 * since MongoDB 3.0, it offers 'Pluggable Storage Engines'.
 *
 * A Storage Engines is the interface between the persistent storage, which we'll call the 'disks',
 * which might be a solid state disk and the database itself.
 *
 * so MongoDB server talks to the disks(the persistent storage) through a storage engine and you as
 * a programmer use a MongoDB driver which talks to the database server using the 'wire protocol' and
 * when it wants to Create, Read, Update and Delete data, it'll talk to the storage engine which will
 * then talk to the disk and all the different structures that hold the documents, the indexes and the
 * metadata involving the documents are all written to the persistent storage by the storage engine.
 *
 * it might be the case where the storage engine itself decides to use memory to optimize the process,
 * in other words the disk is very slow, since the idea of databases is store stuff persistently, what
 * happens is the storage engine has control over memory in your computer and it can decide what to put
 * in memory and what to take out of memory and what to persist the disk and when, so the database server
 * itself defers the handling of memory on the server as well as the disk itself to the storage engine.
 *
 * depend of the type of storage engine you put onto MongoDB, you're going to get different performance
 * characteristics.
 *
 * MongoDB ships with two storage engines, MMAP(default) and Wired Tiger
 */