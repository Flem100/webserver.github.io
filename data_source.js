document.addEventListener('DOMContentLoaded', function() {
    const graphqlEndpoint = 'https://imchatgptcustomaction.azurewebsites.net/graphql';

    fetch(graphqlEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `
            query {
                acts(
                    user: "ChatGPT"
                    apiToken: "bmu48u856u85u6b845bn8n5b6v3"
                    order: { id: ASC }
                    first: 20
                ) {
                    nodes {
                        creditorActType {
                            creditor {
                                name
                            }
                        }
                    }
                }
            }`
        })
    })
    .then(response => response.json())
    .then(result => {
        const nodes = result.data.acts.nodes;
        const creditorNames = {};
        nodes.forEach(node => {
            const creditorName = node.creditorActType.creditor.name;
            if (creditorNames[creditorName]) {
                creditorNames[creditorName] += 1;
            } else {
                creditorNames[creditorName] = 1;
            }
        });

        const labels = Object.keys(creditorNames);
        const data = Object.values(creditorNames);

        const ctx = document.getElementById('myChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Distribution of Cases Among Creditors'
                    }
                }
            }
        });
    });
});
