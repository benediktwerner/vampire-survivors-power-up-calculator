#!/usr/bin/env python3

import random
from collections import Counter
import functools
import itertools

MAX_AMOUNT = 6

for i in range(100):
    print(i)
    costs = [random.randrange(10, 10_000) for _ in range(MAX_AMOUNT)]
    best = {}

    print(costs)

    for count in range(2, MAX_AMOUNT + 1):
        # print(count)
        for perm in itertools.product(range(MAX_AMOUNT), repeat=count):
            key = tuple(sorted(perm))
            total = 0
            multiplier = 10
            used = [0] * MAX_AMOUNT
            for p in perm:
                used[p] += 1
                total += used[p] * costs[p] * multiplier
                multiplier += 1
            curr = best.get(key)
            if curr is None or total < curr[0]:
                best[key] = (total, perm)


    def compare(a, b):
        aFirst = MULTIPLIER[0][a[1]] * a[0] + MULTIPLIER[a[1]][b[1]] * b[0]
        bFirst = MULTIPLIER[0][b[1]] * b[0] + MULTIPLIER[b[1]][a[1]] * a[0]
        return bFirst - aFirst


    MULTIPLIER = []

    for offset in range(MAX_AMOUNT + 1):
        row = [0]
        last = 0
        for amnt in range(1, MAX_AMOUNT + 1):
            last += amnt * (offset + amnt - 1)
            row.append(last)
        MULTIPLIER.append(row)

    for key, (best_total, best_order) in best.items():
        todo = [(costs[x], amnt) for x, amnt in Counter(key).items()]
        result = []
        while todo:
            todo.sort(key=functools.cmp_to_key(compare))
            result.append(todo.pop())
        total = 0
        multiplier = 10
        for cost, amnt in result:
            for i in range(1, amnt + 1):
                total += i * cost * multiplier
                multiplier += 1
        assert total == best_total, f"{best_order}"
