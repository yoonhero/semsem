from torch.utils.data import DataLoader
from transformers import AdamW
import torch
from transformers.utils.dummy_pt_objects import DistilBertForSequenceClassification
from torch.utils.data import Dataset

class CustomDataset(Dataset):
    def __init__(self, encoding, labels):
        self.encoding = encoding
        self.labels = labels 
    
    def __getitem__(self, idx):
        item = {key: torch.tensor(val[idx]) for key, val in self.encoding.items()}
        item["labels"] = torch.tensor(self.labels[idx])
        return item

    def __len__(self):
        return len(self.labels)

train_dataset = Dataset(train_encoding, train_labels)

device = torch.device("cuda" if torch.cuda.is_available else "cpu")

model = DistilBertForSequenceClassification.from_pretrained("distilbert-base-uncased")
model.to(device)
model.train()

train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True)

optim = AdamW(model.parameters(), lr=5e-5)


num_training_epochs = 2

for epoch in range(num_training_epochs):
    for batch in train_loader:
        optim.zero_grad()

        input_ids = batch["input_ids"].to(device)
        attention_mask = batch["attention_mask"].to(device)
        labels = batch["labels"].to(device)

        output = model(input_idsm, attention_mask=attention_mask, labels=labels)

        loss = output[0]
        loss.backward()
        optim.step()

model.eval()