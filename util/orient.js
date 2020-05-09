module.exports = {
    orient: (puzzle) => {
        let rotations = "";
        let moves = puzzle === "222" || puzzle === "444" ? ["x", "y", "z"] : puzzle === "333" ? ["Rw", "Uw", "Fw"] : ["3Rw", "3Uw", "3Fw"];
        for (let i = 0; i < Math.floor(Math.random() * 3); i++) {
            let index = Math.floor(Math.random() * moves.length);
            rotations += `${moves[index]}${Math.random() > 2 / 3 ? "" : Math.random() > 0.5 ? "\'" : "2"} `;
            moves.splice(index, 1);
        }
        return rotations;
    }
};
