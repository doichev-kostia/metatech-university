const source = db('city');

({
    read({ id }) {
        return source.read(id);
    },

    create(data) {
        return source.create(data);
    },

    update({ id, ...data }) {
        return source.update(id, data);
    },

    delete({ id }) {
        return source.delete(id);
    },
})
